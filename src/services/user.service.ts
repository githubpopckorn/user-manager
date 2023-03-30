import { HttpError } from '../exceptions/http.error'
import { type IUser } from '../interfaces/models/user.interface'
import { type UserRepository, type RoleRepository } from '../repositories'
import { BaseService } from './base.service'

export class UserService extends BaseService<IUser> {
  userRepository: UserRepository
  roleRepository: RoleRepository

  constructor ({ UserRepository, RoleRepository }: { UserRepository: UserRepository, RoleRepository: RoleRepository }) {
    super(UserRepository)
    this.userRepository = UserRepository
    this.roleRepository = RoleRepository
  }

  async signUp (user: IUser): Promise<{ createdUser: IUser, token: string }> {
    const { email } = user

    //* * Comprobar si el usuario ya esta registrado en la base de datos */
    const userExist = await this.userRepository.findUserByEmail(email)
    if (userExist != null) {
      const error = new HttpError(400, 'El usuario ya se encuentra registrado')
      throw error
    }

    /** Crear el usuario  */
    const createdUser = await this.userRepository.create(user)

    const token = await createdUser.generateAuthToken()
    return { createdUser, token }
  }

  async signIn (email: string, password: string): Promise<{ user: IUser, token: string }> {
    const user = await this.userRepository.findUserByEmail(email)
      if (user == null) {
        const error = new HttpError(400, 'Correo o clave incorrecto')
        throw error
      }

      const isMatch = user.comparePasswords(password)
      if (!isMatch) {
        const error = new HttpError(400, 'Correo o clave incorrecto')
        throw error
      }

      const token = await user.generateAuthToken()
      return { user, token }
  }

  async signOut (user: IUser, token: string): Promise<boolean> {
    user.tokens = user.tokens.filter((t: string) => t !== token)
    await user.save()
    return true
  }

  async signOutAll (user: IUser): Promise<boolean> {
    user.tokens = []
    await user.save()
    return true
  }

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

  async assignRole (userId: string, roleId: string): Promise<IUser> {
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

    user.roles.push(entityRol)
    await user.save()
    return user
  }
}
