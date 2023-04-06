import { Router, type Request, type RequestHandler, type Response } from 'express'
import { SupportedPermissionsEnum } from '../config/constants'
import { AuthMiddleware, Authorize } from '../middlewares'
import { type UserService } from '../services'
import { ValidateRequest } from '../middlewares/validate-request.middleware'
import { UserSchemas } from '../schemas'
import { RequestParamsEnum } from '../types/types'

export default ({ UserService }: { UserService: UserService }): Router => {
    const router = Router()

    router.get('/', [AuthMiddleware, Authorize([SupportedPermissionsEnum.LIST_USERS]), ValidateRequest(UserSchemas.list, RequestParamsEnum.query)],
    (async (req: Request, res: Response): Promise<void> => {
        const pageSize = parseInt(req.query.pageSize as string)
        const pageNum = parseInt(req.query.pageNum as string)
        const users = await UserService.getAll(pageSize, pageNum)
        res.status(200).send(users)
    }) as RequestHandler)

    router.post('/signUp', [ValidateRequest(UserSchemas.signUp, RequestParamsEnum.body)], (async (req, res) => {
        const user = req.body
        const createdUser = await UserService.create(user)
        res.status(201).send(createdUser)
    }) as RequestHandler)

    router.post('/signIn', [ValidateRequest(UserSchemas.signIn, RequestParamsEnum.body)], (async (req: Request, res: Response) => {
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

    router.post('/:userId/roles/:roleId',
    [AuthMiddleware, Authorize([SupportedPermissionsEnum.ASSIGN_ROLE])],
    (async (req: Request, res: Response) => {
        const { userId, roleId } = req.params
        const assignedRole = await UserService.assignRole(userId, roleId, req.user!.roles)
        res.status(200).send({ success: assignedRole, message: 'El rol fue asignado exitosamente' })
    }) as RequestHandler)

    router.delete('/:userId/roles/:roleId',
    [AuthMiddleware, Authorize([SupportedPermissionsEnum.REMOVE_ROLE])],
    (async (req: Request, res: Response) => {
        const { userId, roleId } = req.params
        const removedRole = await UserService.removeRole(userId, roleId, req.user!.roles)
        res.status(200).send({ success: removedRole, message: 'El rol fue quitado existosamente' })
    }) as RequestHandler)

    router.post('/lockUser',
    [AuthMiddleware, Authorize([SupportedPermissionsEnum.LOCK_USER]), ValidateRequest(UserSchemas.emailSchema, RequestParamsEnum.body)],
    (async (req: Request, res: Response) => {
        const { email } = req.body
        const lockedUser = await UserService.lockUser(email)
        res.status(200).send({ success: lockedUser, message: 'El usuario fue bloqueado exitosamente' })
    }) as RequestHandler)

    router.post('/unlockUser',
    [AuthMiddleware, Authorize([SupportedPermissionsEnum.UNLOCK_USER]), ValidateRequest(UserSchemas.emailSchema, RequestParamsEnum.body)],
    (async (req: Request, res: Response) => {
        const { email } = req.body
        const unlockedUser = await UserService.unlockUser(email)
        res.status(200).send({ success: unlockedUser, message: 'El usuario fue desbloqueado exitosamente' })
    }) as RequestHandler)

    router.post('/requestPasswordReset', [ValidateRequest(UserSchemas.emailSchema, RequestParamsEnum.body)], (async (req: Request, res: Response) => {
        const { email } = req.body
        const resetPassword = await UserService.requestPasswordReset(email)
        res.status(200).send({ success: resetPassword, message: 'Se envió un link al correo registrado para restablecer la contraseña' })
    }) as RequestHandler)

    router.get('/checkPasswordResetToken/:token', (async (req: Request, res: Response) => {
        const token = req.params.token
        const checkToken = await UserService.checkResetPasswordToken(token)
        res.status(200).send({ success: checkToken, message: 'El token es válido' })
    }) as RequestHandler)

    router.post('/resetPassword',
    [ValidateRequest(UserSchemas.resetPassword, RequestParamsEnum.body)],
    (async (req: Request, res: Response) => {
        const { token, password, confirmPassword } = req.body
        const resetPassword = await UserService.resetPassword(token, password, confirmPassword)
        res.status(200).send({ success: resetPassword, message: 'La contraseña fue restablecida exitosamente' })
    }) as RequestHandler)

    return router
}
