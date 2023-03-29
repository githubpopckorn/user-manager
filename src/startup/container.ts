import { createContainer, asClass, asValue, asFunction } from 'awilix'

// Importamos las configuraciones
import { Config } from "../config"
import app from "."

// Services
import { UserService } from "../services"

// Routes
import UserRoute from "../routes/user.routes"
import Routes from "../routes/index"

// Models
import { User } from "../models"

// Repositories
import { UserRepository } from "../repositories"

const container = createContainer()
container.register({
  app: asClass(app).singleton(),
  router: asFunction(Routes).singleton(),
  config: asValue(Config),
})
.register({
  UserRepository: asClass(UserRepository).singleton()
})
.register({
  UserModel: asValue(User)
})
.register({
  UserRoute: asFunction(UserRoute).singleton()
})
.register({
  UserService: asClass(UserService).singleton()
})

export default container;
