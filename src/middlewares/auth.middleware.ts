import { type NextFunction, type Request, type Response } from 'express'
import jwt from 'jsonwebtoken'
import { Config } from '../config'
import { HttpError } from '../exceptions/http.error'
import { User } from '../models'
import { type IPermission } from '../interfaces/models/permission.interface'

export const AuthMiddleware = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  // eslint-disable-next-line no-useless-catch
  try {
    if (req.header('Authorization') == null) {
        const error = new HttpError(400, 'Unauthorized')
        throw error
    }

    const token = req.header('Authorization')!.replace('Bearer ', '')
    const decodedToken = jwt.verify(token, Config.JWT_SECRET) as { sub: string }

    /** Buscar el usuario que viene en el token */
    const user = await User.findOne({ _id: decodedToken.sub, 'tokens.token': token })

    if (user == null) {
        const error = new HttpError(401, 'Invalid token')
        throw error
    }

    /** Agregar en el request los nuevos datos */
    req.user = user
    req.token = token
    req.roles = user.roles

    /** Agregar los permisos del usuario al request */
    let permissions: IPermission[] = []
    user.roles.forEach(role => {
      /** Si el role no tiene asignado ninguna permiso entonces debemos devolver un array vacio [] */
      if (role.permissions == null || role.permissions === undefined) return
      permissions = permissions.concat(role.permissions)
    })
    req.permissions = permissions

    /** Continuar con el siguiente middleware */
    next()
  } catch (error) {
    throw error
  }
}
