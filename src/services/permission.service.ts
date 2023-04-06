import { type IPermission } from '../interfaces/models/permission.interface'
import { type PermissionRepository } from '../repositories/permission.repository'
import { BaseService } from './base.service'
import { PermissionsData } from '../Utils/seed-data'

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
}
