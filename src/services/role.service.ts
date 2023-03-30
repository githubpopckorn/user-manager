import { BaseService } from './base.service'
import { type RoleRepository } from '../repositories'
import { type IRole } from '../interfaces/models/role.interface'
import { HttpError } from '../exceptions/http.error'

export class RoleService extends BaseService<IRole> {
  roleRepository: RoleRepository

  constructor ({ RoleRepository }: { RoleRepository: RoleRepository }) {
    super(RoleRepository)
    this.roleRepository = RoleRepository
  }

  async createRole (role: IRole): Promise<IRole> {
    const { name } = role

    const roleExist = await this.roleRepository.findByName(name)
    if (roleExist != null) {
      const error = new HttpError(400, 'El role ya se encuentra registrado')
      throw error
    }

    return await this.roleRepository.create(role)
  }
}
