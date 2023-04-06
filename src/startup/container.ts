import { createContainer, asClass, asValue, asFunction } from 'awilix'

// Importamos las configuraciones
import { Config } from '../config'
import app from '.'

// Services
import { UserService, RoleService, PermissionService } from '../services'

// Routes
import UserRoute from '../routes/user.routes'
import RoleRoute from '../routes/role.routes'
import PermissionRoute from '../routes/permission.routes'
import Routes from '../routes/index'

// Models
import { User, Role, Permission } from '../models'

// Repositories
import { UserRepository, RoleRepository, PermissionRepository } from '../repositories'

const container = createContainer()
container.register({
  app: asClass(app).singleton(),
  router: asFunction(Routes).singleton(),
  config: asValue(Config)
})
  .register({
    UserRepository: asClass(UserRepository).singleton(),
    RoleRepository: asClass(RoleRepository).singleton(),
    PermissionRepository: asClass(PermissionRepository).singleton()
  })
  .register({
    UserModel: asValue(User),
    RoleModel: asValue(Role),
    PermissionModel: asValue(Permission)
  })
  .register({
    UserRoute: asFunction(UserRoute).singleton(),
    RoleRoute: asFunction(RoleRoute).singleton(),
    PermissionRoute: asFunction(PermissionRoute).singleton()
  })
  .register({
    UserService: asClass(UserService).singleton(),
    RoleService: asClass(RoleService).singleton(),
    PermissionService: asClass(PermissionService).singleton()
  })

export default container
