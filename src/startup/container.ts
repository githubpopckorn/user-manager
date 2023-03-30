import { createContainer, asClass, asValue, asFunction } from 'awilix'

// Importamos las configuraciones
import { Config } from '../config'
import app from '.'

// Services
import { UserService, RoleService } from '../services'

// Routes
import UserRoute from '../routes/user.routes'
import RoleRoute from '../routes/role.routes'
import Routes from '../routes/index'

// Models
import { User, Role } from '../models'

// Repositories
import { UserRepository, RoleRepository } from '../repositories'

const container = createContainer()
container.register({
  app: asClass(app).singleton(),
  router: asFunction(Routes).singleton(),
  config: asValue(Config)
})
  .register({
    UserRepository: asClass(UserRepository).singleton(),
    RoleRepository: asClass(RoleRepository).singleton()
  })
  .register({
    UserModel: asValue(User),
    RoleModel: asValue(Role)
  })
  .register({
    UserRoute: asFunction(UserRoute).singleton(),
    RoleRoute: asFunction(RoleRoute).singleton()
  })
  .register({
    UserService: asClass(UserService).singleton(),
    RoleService: asClass(RoleService).singleton()
  })

export default container
