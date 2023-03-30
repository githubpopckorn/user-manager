import { type RequestHandler, Router, type Request, type Response } from 'express'
import { AuthMiddleware } from '../middlewares'
import { type UserService } from '../services'

export default ({ UserService }: { UserService: UserService }): Router => {
  const router = Router()

  router.post('/signUp', (async (req, res) => {
    const user = req.body
    const createdUser = await UserService.create(user)
    res.status(201).send(createdUser)
  }) as RequestHandler)

  router.post('/signIn', (async (req: Request, res: Response) => {
    const { email, password } = req.body
    const user = await UserService.signIn(email, password)
    console.log(user)
    res.status(200).send(user)
  }) as RequestHandler)

  router.post('/signOut', [AuthMiddleware], (async (req: Request, res: Response) => {
    const user = req.user!
    const token = req.token
    const signOut = await UserService.signOut(user, token)
    res.status(201).send(signOut)
  }) as RequestHandler)

  router.post('/signOutAll', [AuthMiddleware], (async (req: Request, res: Response) => {
    const user = req.user!
    const loggedOutAll = await UserService.signOutAll(user)
    res.status(201).send(loggedOutAll)
  }) as RequestHandler)

  router.get('/me', [AuthMiddleware], (async (req: Request, res: Response) => {
    const user = req.user!
    const userData = await UserService.getProfile(user._id)
    res.status(200).send(userData)
  }) as RequestHandler)

  router.post('/assignRole', [AuthMiddleware], (async (req: Request, res: Response) => {
    const { userId, roleId } = req.body
    const assignedRole = await UserService.assignRole(userId, roleId)
    res.status(200).send(assignedRole)
  }) as RequestHandler)

  return router
}
