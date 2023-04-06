import { type IPermission } from '../interfaces/models/permission.interface'
import { type PermissionRepository } from '../repositories/permission.repository'
import { BaseService } from './base.service'
import { PermissionsData } from '../Utils/seed-data'
import { HttpError } from '../exceptions/http.error'

export class PermissionService extends BaseService<IPermission> {
    permissionRepository: PermissionRepository
    constructor ({ PermissionRepository }: { PermissionRepository: PermissionRepository }) {
        super(PermissionRepository)
        this.permissionRepository = PermissionRepository
    }

    /**
     * Crea los permisos si es que no los encuentra ya creados en la base de datos, los datos los toma de Utils/seed-data.ts
     * @returns {Promise<void>}
     */
    async seedPermissions (): Promise<void> {
        for (const permission of PermissionsData) {
            const permissionExist = await this.permissionRepository.findByCode(permission.code)
            if (permissionExist == null) {
                await this.permissionRepository.create(permission)
            }
        }
    }

    async deletePermission (id: string): Promise<boolean | null> {
        const permission = await this.permissionRepository.findByIdPopulated(id)
        if (permission == null) {
            const error = new HttpError(404, 'No se encontró el permiso')
            throw error
        }

        if (permission.roles !== undefined && permission.roles.length > 0) {
            const error = new HttpError(400, 'No se puede eliminar el permiso porque está asignado a uno o más roles')
            throw error
        }

        await this.permissionRepository.delete(id)
        return true
    }
}
