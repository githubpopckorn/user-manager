import { type Model } from 'mongoose'
import { type IRole } from '../interfaces/models/role.interface'
import { BaseRepository } from './base.repository'

export class RoleRepository extends BaseRepository<IRole> {
  roleModel: Model<IRole>
  constructor ({ RoleModel }: { RoleModel: Model<IRole> }) {
    super(RoleModel)
    this.roleModel = RoleModel
  }

  async findByName (name: string): Promise<IRole | null> {
    return await this.roleModel.findOne({ name })
  }

  async findByIdPopulated (id: string): Promise<IRole | null> {
    return await this.roleModel.findOne({ _id: id }).populate('users')
  }
}
