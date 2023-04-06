import { type Model } from 'mongoose'
import { type IPermission } from '../interfaces/models/permission.interface'
import { BaseRepository } from './base.repository'

export class PermissionRepository extends BaseRepository<IPermission> {
    permissionModel: Model<IPermission>

    constructor ({ PermissionModel }: { PermissionModel: Model<IPermission> }) {
        super(PermissionModel)
        this.permissionModel = PermissionModel
    }

    async findByName (name: string): Promise<IPermission | null> {
        return await this.permissionModel.findOne({ name })
    }

    async findByCode (code: string): Promise<IPermission | null> {
        return await this.permissionModel.findOne({ code })
    }
}
