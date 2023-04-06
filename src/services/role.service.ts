import { BaseService } from './base.service'
import { type PermissionRepository, type RoleRepository } from '../repositories'
import { type IRole } from '../interfaces/models/role.interface'
import { HttpError } from '../exceptions/http.error'
import { RolesData, RolesPermissionsData } from '../Utils/seed-data'

export class RoleService extends BaseService<IRole> {
  roleRepository: RoleRepository
  permissionRepository: PermissionRepository

  constructor ({ RoleRepository, PermissionRepository }: { RoleRepository: RoleRepository, PermissionRepository: PermissionRepository }) {
    super(RoleRepository)
    this.roleRepository = RoleRepository
    this.permissionRepository = PermissionRepository
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

  async assignPermissionToRole (roleName: string, permissionCode: string): Promise<boolean> {
    const rol = await this.roleRepository.findByName(roleName)

    if (rol == null) {
      const error = new HttpError(404, 'El role no existe')
      throw error
    }

    const permission = await this.permissionRepository.findByCode(permissionCode)
    if (permission == null) {
      const error = new HttpError(404, 'El permiso no existe')
      throw error
    }

    if (rol.permissions.find(p => p.code === permissionCode) != null) {
      const error = new HttpError(400, 'El permiso ya se encuentra asignado al role')
      throw error
    }

    rol.permissions.push(permission)
    await rol.save()
    return true
  }

  async removePermissionFromRole (roleName: string, permissionCode: string): Promise<boolean> {
    const rol = await this.roleRepository.findByName(roleName)
    if (rol == null) {
      const error = new HttpError(404, 'El role no existe')
      throw error
    }

    if (rol.permissions.find(p => p.code === permissionCode) == null) {
      const error = new HttpError(404, 'El permiso no se encuentra asignado al role')
      throw error
    }

    rol.permissions = rol.permissions.filter(p => p.code !== permissionCode)
    await rol.save()
    return true
  }

  async deleteRole (id: string): Promise<boolean | null> {
    const role = await this.roleRepository.findByIdPopulated(id)
    if (role == null) {
      const error = new HttpError(404, 'No se encontró el role')
      throw error
    }

    if (role.users !== undefined && role.users.length > 0) {
      const error = new HttpError(400, 'No se puede eliminar el rol porque está asignado a uno o más usuarios')
      throw error
    }

    await this.roleRepository.delete(id)
    return true
  }

  async seedRoles (): Promise<void> {
    for (const role of RolesData) {
      const roleExist = await this.roleRepository.findByName(role.name)
      if (roleExist == null) {
        await this.roleRepository.create(role)
      }
    }
  }

  async seedPermissionRole (): Promise<void> {
    for (const rolePermission of RolesPermissionsData) {
      for (const permission of rolePermission.permissions) {
        const rol = await this.roleRepository.findByName(rolePermission.role)
        if (rol == null) {
          const error = new HttpError(404, 'El role no existe')
          throw error
        }
        const hasPermission = rol.permissions.find(p => p.code === permission)
        if (hasPermission == null) {
          await this.assignPermissionToRole(rolePermission.role, permission)
        }
      }
    }
  }
}
