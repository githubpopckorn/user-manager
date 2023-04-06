import { type NextFunction, type Request, type Response } from 'express'
import { HttpError } from '../exceptions/http.error'
import { SupportedRolesEnum, type SupportedPermissions } from '../types/types'

export const Authorize = (permissions: SupportedPermissions[]) =>
    async (req: Request, _res: Response, next: NextFunction) => {
        /** Recupero los roles y los permisos desde el request, estos permisos fueron establecidos en el request desde el  AuthMiddleware */
        const userRoles = req.roles.map(role => role.name)
        const userPermissions = req.permissions.map(permission => permission.code)

        /** Si el usuario es SuperAdmin debe permitir el acceso a todo */
        if (userRoles.includes(SupportedRolesEnum.SUPERADMIN)) {
            next()
            return
        }

        /** Comprobar si alguno de los permisos que vienen como parametros coincide con los asignados al usuario */
        const hasPermission = permissions.some(permission => userPermissions.includes(permission))

        if (!hasPermission) {
            const error = new HttpError(403, 'No tienes permisos para acceder a esta opcion')
            throw error
        }

        next()
    }
