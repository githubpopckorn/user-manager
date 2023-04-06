import { type IConfig } from '../config'
import { HttpError } from '../exceptions/http.error'
import { type IUser } from '../interfaces/models/user.interface'
import { type UserRepository, type RoleRepository } from '../repositories'
import { BaseService } from './base.service'
import jwt from 'jsonwebtoken'
import moment from 'moment'
import { type IResetToken } from '../interfaces/models/resettoken.interface'
import { type IRole } from '../interfaces/models/role.interface'
import { SupportedRolesEnum } from '../types/types'

export class UserService extends BaseService<IUser> {
  userRepository: UserRepository
  roleRepository: RoleRepository
  private readonly _config: IConfig

  constructor ({ UserRepository, RoleRepository, config }: { UserRepository: UserRepository, RoleRepository: RoleRepository, config: IConfig }) {
    super(UserRepository)
    this.userRepository = UserRepository
    this.roleRepository = RoleRepository
    this._config = config
  }

  /**
   * @description Crea un usuario y genera un token de autenticacion
   * @param {IUser} user
   * @returns {Promise<{ createdUser: IUser, token: string }>}
   */
  async signUp (user: IUser): Promise<{ createdUser: IUser, token: string }> {
    const { email } = user

    /** Comprobar si el usuario ya esta registrado en la base de datos */
    const userExist = await this.userRepository.findUserByEmail(email)
    if (userExist != null) {
      const error = new HttpError(400, 'El usuario ya se encuentra registrado')
      throw error
    }

    /** Crear el usuario  */
    user.locked = false
    user.loginAttempts = 0
    user.lockUntil = 0
    user.resetPasswordAttemps = 0
    user.resetPasswordLockUntil = 0
    const createdUser = await this.userRepository.create(user)

    const token = await createdUser.generateAuthToken()
    return { createdUser, token }
  }

  /**
   * Inicia session de un usuario y genera un token de autenticacion
   * controla que el usuario se encuentre registrado y que las credenciales sean correctas
   * controla que el usuario no este bloqueado y si esta bloqueado controla que ya paso el tiempo de bloqueo
   * controla que el usuario no supere el numero maximo de intentos de inicio de session o lo bloquea
   * @param email {string}
   * @param password {string}
   * @returns {Promise<{ user: IUser, token: string }>}
   */
  async signIn (email: string, password: string): Promise<{ user: IUser, token: string }> {
    const user = await this.userRepository.findUserByEmail(email)
    if (user == null) {
      const error = new HttpError(400, 'El usuario no se encuentra registrado')
      throw error
    }

    const isMatch = await user.comparePasswords(password)
    /** Si las credenciales son correctas comprobar que el usuario no este bloqueado */
    /** Y debe comprobar que si existe una fecha de desbloqueo y ya paso ese tiempo debe desbloquearlo */
    if (isMatch && user.locked) {
      await this.checkIfUserCanUnlockAndUnlock(user)
    }

    /** Si no es correcta la constrasenia aumentar los intentos de inicio de session */
    if (!isMatch) {
      if (user.loginAttempts >= this._config.MAX_LOGIN_ATTEMPTS) {
        user.locked = true
        user.lockUntil = moment().add(this._config.LOCK_TIME, 'minutes').unix()
        await user.save()
        const error = new HttpError(423, 'El usuario se ha bloqueado por superar el número maximo de intentos')
        throw error
      }

      user.loginAttempts += 1
      await user.save()
      const error = new HttpError(400, 'Correo o clave incorrecto')
      throw error
    }

    const token = await user.generateAuthToken()
    return { user, token }
  }

  /**
   * Bloquea al usuario por un tiempo indefinido hasta que el administrador lo desbloquee
   * @param email {string}
   * @returns  {Promise<{ user: IUser, token: string }>}
   */
  async lockUser (email: string): Promise<boolean> {
    const user = await this.userRepository.findUserByEmail(email)
    if (user == null) {
      const error = new HttpError(400, 'No se encontró el usuario')
      throw error
    }

    user.locked = true
    user.lockUntil = 0
    await user.save()
    return true
  }

  /**
   * Bloquea al usuario por un tiempo determinado en minutos
   * @param email {string}
   * @param minutes {number}
   * @returns {Promise<IUser>}
   */
  async lockUserUntil (email: string, minutes: number): Promise<IUser> {
    const user = await this.userRepository.findUserByEmail(email)
    if (user == null) {
      const error = new HttpError(400, 'No se encontró el usuario')
      throw error
    }

    user.locked = true
    user.lockUntil = moment().add(minutes, 'minutes').unix()
    await user.save()
    return user
  }

  /**
   * Desbloque al usuario
   * @param email {string}
   * @returns {Promise<boolean>}
   */
  async unlockUser (email: string): Promise<boolean> {
    const user = await this.userRepository.findUserByEmail(email)
    if (user == null) {
      const error = new HttpError(400, 'No se encontró el usuario')
      throw error
    }

    user.locked = false
    user.loginAttempts = 0
    user.lockUntil = 0
    user.resetPasswordAttemps = 0
    user.resetPasswordLockUntil = 0
    await user.save()
    return true
  }

  hello (): string {
    return 'Hello'
  }

  /**
   *  Genera un token de recuperacion de contraseña y lo envia al correo del usuario
   *  si el usuario esta bloqueado comprueba si puede desbloquearse y lo desbloquea
   *  caso contrario no se genera token de recuperacion sobre usuarios bloqueados
   *  @param email: string
   *  @returns boolean
   */
  async requestPasswordReset (email: string): Promise<boolean> {
    const user = await this.userRepository.findUserByEmail(email)
    if (user == null) {
      const error = new HttpError(400, 'El usuario no se encuentra registrado')
      throw error
    }

    if (user.locked) {
      await this.checkIfUserCanUnlockAndUnlock(user)
    }

    const token = await user.generatePasswordResetToken()
    console.log('Token', token)
    return true
  }

  /**
   *  Realiza comprobaciones del token para saber si es valido
   *  si no es valido lanza una excepcion con el codigo error 400
   *  @param token: string
   *  @returns boolean
   */
  async checkResetPasswordToken (token: string): Promise<boolean> {
    const decodedToken = jwt.verify(token, this._config.JWT_RESET_SECRET) as { email: string }

    /** Buscar el usuario que viene en el token */
    const user = await this.userRepository.findUserByEmail(decodedToken.email)
    if (user == null) {
      const error = new HttpError(400, 'El token no es valido')
      throw error
    }

    /** Comprueba que el usuario haya solicitado tokens */
    const userResetTokens = user.resetPasswordTokens
    if (userResetTokens.length === 0) {
      const error = new HttpError(400, 'El link de recuperación de contraseña es invalido')
      throw error
    }

    /** Comprobar si el token se encuentra en los solicitados por el usuario */
    const tokenExist = userResetTokens.find((t: IResetToken) => t.token === token)
    if (tokenExist == null) {
      const error = new HttpError(400, 'El link de recuperación de contraseña es invalido')
      throw error
    }

    /** Comprobar si el token ya fue utilizado */
    if (tokenExist.used) {
      const error = new HttpError(400, 'El link de recuperación de contraseña ya fue utilizado')
      throw error
    }

    return true
  }

  /**
   * Cambia la constraseña del usuario con las comprobaciones necesarias
   * despues actualiza el token a used = true
   * @param token {string}
   * @param password {string}
   * @returns {Promise<boolean>}
   */
  async resetPassword (token: string, password: string, confirmPassword: string): Promise<boolean> {
    if (password !== confirmPassword) {
      const error = new HttpError(400, 'Las contraseñas no coinciden')
      throw error
    }

    await this.checkResetPasswordToken(token)

    const decodedToken = jwt.verify(token, this._config.JWT_RESET_SECRET) as { email: string }

    /** Buscar el usuario que viene en el token */
    const user = await this.userRepository.findUserByEmail(decodedToken.email)
    if (user == null) {
      const error = new HttpError(400, 'El usuario no fue encontrado')
      throw error
    }

    user.password = password
    user.resetPasswordAttemps = 0
    user.resetPasswordLockUntil = 0
    user.resetPasswordTokens = user.resetPasswordTokens.map((t: IResetToken) => {
      if (t.token === token) {
        t.used = true
      }
      return t
    })
    await user.save()
    return true
  }

  /**
   * Elimina el token de acceso del usuario actual
   * @param user {IUser}
   * @param token {string}
   * @returns {Promise<boolean>}
   */
  async signOut (user: IUser, token: string): Promise<boolean> {
    user.tokens = user.tokens.filter((t: string) => t !== token)
    await user.save()
    return true
  }

  /**
   * Eliminar todos los tokens de acceso del usuario
   * @param user {IUser}
   * @returns {Promise<boolean>}
   */
  async signOutAll (user: IUser): Promise<boolean> {
    user.tokens = []
    await user.save()
    return true
  }

  /**
   * Obtiene la informacion de usuario logeado de la tabla User
   * @param userId {string}
   * @returns {Promise<IUser>}
   */
  async getProfile (userId: string): Promise<IUser> {
    if (userId.length === 0) {
      const error = new HttpError(400, 'Parametro id debe ser enviado')
      throw error
    }

    const user = await this.userRepository.findById(userId)
    if (user == null) {
      const error = new HttpError(400, 'No se encontró el usuario')
      throw error
    }
    return user
  }

  /**
   * Asigna un nuevo rol al usuario
   * Solo un usuario con rol superadmin puede asignar este rol a otro usuario
   * devueve un error si el usuario ya tiene asignado el rol
   * @param userId id del usuario al que se le asignara el rol
   * @param roleId id del rol a asignar
   * @param performedActionUserRoles roles del usuario que realiza la accion
   * @returns
   */
  async assignRole (userId: string, roleId: string, performedActionUserRoles: IRole[]): Promise<boolean> {
    const user = await this.userRepository.findById(userId)
    if (user == null) {
      const error = new HttpError(400, 'No se encontró el usuario')
      throw error
    }

    const entityRol = await this.roleRepository.findById(roleId)
    if (entityRol == null) {
      const error = new HttpError(400, 'No se encontró el rol')
      throw error
    }

    if (entityRol.name === SupportedRolesEnum.SUPERADMIN) {
      if (!performedActionUserRoles.some((r: IRole) => r.name === SupportedRolesEnum.SUPERADMIN)) {
        const error = new HttpError(404, 'No tienes los permisos necesarios para asignar este rol')
        throw error
      }
    }

    if (user.roles.some((r: IRole) => r.name === entityRol.name)) {
      const error = new HttpError(400, 'El usuario ya tiene este rol asignado')
      throw error
    }

    user.roles.push(entityRol)
    await user.save()
    return true
  }

  /**
   * Quita el rol a un usuario, solo un usuario con rol superadmin puede quitar este rol a otro usuario
   * valida que no le remuevan el rol a un usuario creador
   * @param userId Usuario al que se le va a remover el rol
   * @param roleId Rol que se va a remover
   * @param performedActionUserRoles Roles del usuario que esta realizando la accion
   * @returns
   */
  async removeRole (userId: string, roleId: string, performedActionUserRoles: IRole[]): Promise<boolean> {
    const user = await this.userRepository.findById(userId)
    if (user == null) {
      const error = new HttpError(400, 'No se encontró el usuario')
      throw error
    }

    const entityRol = await this.roleRepository.findById(roleId)
    if (entityRol == null) {
      const error = new HttpError(400, 'No se encontró el rol')
      throw error
    }

    if (!user.roles.some((r: IRole) => r.name === entityRol.name)) {
      const error = new HttpError(400, 'El usuario no tiene asignado este rol')
      throw error
    }

    if (entityRol.name === SupportedRolesEnum.SUPERADMIN) {
      if (!performedActionUserRoles.some((r: IRole) => r.name === SupportedRolesEnum.SUPERADMIN)) {
        const error = new HttpError(404, 'No tienes los permisos necesarios para quitar este rol')
        throw error
      } else if (user.isCreator) {
        const error = new HttpError(404, `No puedes quitar el rol ${entityRol.name} a tu creador`)
        throw error
      }
    }

    if (!user.roles.some((role: IRole) => role.name === entityRol.name)) {
      const error = new HttpError(400, 'El usuario no tiene asignado este rol')
      throw error
    }

    user.roles = user.roles.filter((role: IRole) => role.name !== entityRol.name)
    await user.save()
    return true
  }

  /**
   * Comprueba si el usuario puede desbloquearse y lo desbloquea
   * caso contrario lanza una excepcion
   */
  async checkIfUserCanUnlockAndUnlock (user: IUser): Promise<void> {
    // Todo: revisar porque no funciona
    const now = moment()
    const lockeUntil = moment.unix(user.lockUntil)
    if (user.lockUntil !== 0 && now.isAfter(lockeUntil)) {
      user.locked = false
      user.loginAttempts = 0
      user.lockUntil = 0
      await user.save()
    } else {
      const error = new HttpError(423, 'El usuario se encuentra bloqueado')
      throw error
    }
  }

  async getUserByEmail (email: string): Promise<IUser> {
    console.log('aaaa')
    const user = await this.userRepository.findUserByEmail(email)
    if (user == null) {
      const error = new HttpError(400, 'No se encontró el usuario')
      throw error
    }
    return user
  }
}
