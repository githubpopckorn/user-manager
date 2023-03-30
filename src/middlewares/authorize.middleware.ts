import { type NextFunction, type Request, type Response } from 'express'
import { HttpError } from '../exceptions/http.error'
import { SupportedRolesEnum, type SupportedRoles } from '../types/types'

export const AuthorizeRole = (roles: SupportedRoles[]) =>
    async (req: Request, _res: Response, next: NextFunction) => {
        /** Recupero los permisos desde el request, estos permisos fueron establecidos en el request desde el  AuthMiddleware */
        const userRoles = req.roles.map(role => role.name)

        /** Si el usuario es SuperAdmin debe permitir el acceso a todo */
        if (userRoles.includes(SupportedRolesEnum.SUPERADMIN)) {
            next()
            return
        }

        /** Comprobar si alguno de los permisos que vienen como parametros coincide con los asignados al usuario */
        const hasPermission = roles.some(role => userRoles.includes(role))

        if (!hasPermission) {
            const error = new HttpError(403, 'No tienes permisos para acceder a esta opcion')
            throw error
        }

        next()
    }
