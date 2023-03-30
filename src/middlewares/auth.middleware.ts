import { type Request, type NextFunction, type Response } from 'express'
import jwt from 'jsonwebtoken'
import { Config } from '../config'
import { HttpError } from '../exceptions/http.error'
import { type IUser } from '../interfaces/models/user.interface'
import { User } from '../models'

export const AuthMiddleware = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  // eslint-disable-next-line no-useless-catch
  try {
    if (req.header('Authorization') == null) {
        const error = new HttpError(400, 'Unauthorized')
        throw error
    }

    const token = req.header('Authorization')!.replace('Bearer ', '')
    const decodedToken = jwt.verify(token, Config.JWT_SECRET) as { user: IUser }

    /** Buscar el usuario que viene en el token */
    const user = await User.findOne({ _id: decodedToken.user._id, 'tokens.token': token })
    if (user == null) {
        const error = new HttpError(401, 'Invalid token')
        throw error
    }

    /** Agregar en el request los nuevos datos */
    req.user = user
    req.token = token
    req.roles = user.roles

    /** Continuar con el siguiente middleware */
    next()
  } catch (error) {
    throw error
  }
}
