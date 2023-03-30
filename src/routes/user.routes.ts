import { type RequestHandler, Router, type Request, type Response } from 'express'
import { AuthMiddleware, AuthorizeRole } from '../middlewares'
import { type UserService } from '../services'
import { SupportedRolesEnum } from '../types/types'

export default ({ UserService }: { UserService: UserService }): Router => {
    const router = Router()

    router.get('/', [AuthMiddleware, AuthorizeRole([SupportedRolesEnum.ADMIN])], (async (req: Request, res: Response): Promise<void> => {
        const pageSize = parseInt(req.query.pageSize as string)
        const pageNum = parseInt(req.query.pageNum as string)
        const users = await UserService.getAll(pageSize, pageNum)
        console.log(users)
        res.status(200).send(users)
    }) as RequestHandler)

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

    router.post('/assignRole', [AuthMiddleware, AuthorizeRole([SupportedRolesEnum.ADMIN])], (async (req: Request, res: Response) => {
        const { userId, roleId } = req.body
        const assignedRole = await UserService.assignRole(userId, roleId, req.user!.roles)
        res.status(200).send({ success: assignedRole, message: 'El rol fue asignado exitosamente' })
    }) as RequestHandler)

    router.post('/removeRole', [AuthMiddleware, AuthorizeRole([SupportedRolesEnum.ADMIN])], (async (req: Request, res: Response) => {
        const { userId, roleId } = req.body
        const removedRole = await UserService.removeRole(userId, roleId, req.user!.roles)
        res.status(200).send({ success: removedRole, message: 'El rol fue quitado existosamente' })
    }) as RequestHandler)

    router.post('/lockUser', [AuthMiddleware, AuthorizeRole([SupportedRolesEnum.ADMIN])], (async (req: Request, res: Response) => {
        const { email } = req.body
        const lockedUser = await UserService.lockUser(email)
        res.status(200).send({ success: lockedUser, message: 'El usuario fue bloqueado exitosamente' })
    }) as RequestHandler)

    router.post('/unlockUser', [AuthMiddleware, AuthorizeRole([SupportedRolesEnum.ADMIN])], (async (req: Request, res: Response) => {
        const { email } = req.body
        const unlockedUser = await UserService.unlockUser(email)
        res.status(200).send({ success: unlockedUser, message: 'El usuario fue desbloqueado exitosamente' })
    }) as RequestHandler)

    router.post('/requestPasswordReset', (async (req: Request, res: Response) => {
        const { email } = req.body
        const resetPassword = await UserService.requestPasswordReset(email)
        res.status(200).send({ success: resetPassword, message: 'Se envió un link al correo registrado para restablecer la contraseña' })
    }) as RequestHandler)

    router.get('/checkPasswordResetToken/:token', (async (req: Request, res: Response) => {
        const token = req.params.token
        const checkToken = await UserService.checkResetPasswordToken(token)
        res.status(200).send({ success: checkToken, message: 'El token es válido' })
    }) as RequestHandler)

    router.post('/resetPassword', (async (req: Request, res: Response) => {
        const { token, password } = req.body
        const resetPassword = await UserService.resetPassword(token, password)
        res.status(200).send({ success: resetPassword, message: 'La contraseña fue restablecida exitosamente' })
    }) as RequestHandler)

    return router
}
