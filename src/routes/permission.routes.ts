import { type RequestHandler, Router, type Request, type Response, type NextFunction } from 'express'
import { type PermissionService } from '../services'
import { AuthMiddleware, Authorize } from '../middlewares'
import { SupportedPermissionsEnum } from '../config/constants'
import { ValidateRequest } from '../middlewares/validate-request.middleware'
import { PermissionSchemas } from '../schemas'
import { RequestParamsEnum } from '../types/types'

export default ({ PermissionService }: { PermissionService: PermissionService }): Router => {
    const router = Router()

    router.get('/',
    [AuthMiddleware, Authorize([SupportedPermissionsEnum.LIST_PERMISSION]), ValidateRequest(PermissionSchemas.list, RequestParamsEnum.query)],
    (async (req: Request, res: Response, _next: NextFunction) => {
        const pageSize = parseInt(req.query.pageSize as string)
        const pageNum = parseInt(req.query.pageNum as string)
        const permissions = await PermissionService.getAll(pageSize, pageNum)
        res.status(200).send({ success: true, data: permissions })
    }) as RequestHandler)

    router.get('/:id',
    [AuthMiddleware, Authorize([SupportedPermissionsEnum.SEE_PERMISSION]), ValidateRequest(PermissionSchemas.get, RequestParamsEnum.params)],
    (async (req: Request, res: Response, _next: NextFunction) => {
        const { id } = req.params
        const permission = await PermissionService.getById(id)
        res.status(200).send({ success: true, data: permission })
    }) as RequestHandler)

    router.post('/',
    [AuthMiddleware, Authorize([SupportedPermissionsEnum.CREATE_PERMISSION]), ValidateRequest(PermissionSchemas.permission, RequestParamsEnum.body)],
    (async (req: Request, res: Response, _next: NextFunction) => {
        const permission = req.body
        const createdPermission = await PermissionService.create(permission)
        res.status(201).send({ success: true, data: createdPermission })
    }) as RequestHandler)

    router.patch('/:id',
    [AuthMiddleware, Authorize([SupportedPermissionsEnum.UPDATE_PERMISSION]), ValidateRequest(PermissionSchemas.permission, RequestParamsEnum.body)],
    (async (req: Request, res: Response, _next: NextFunction) => {
        const { id } = req.params
        const permission = req.body
        const updatedPermission = await PermissionService.update(id, permission)
        res.status(200).send({ success: true, data: updatedPermission })
    }) as RequestHandler)

    router.delete('/:id',
    [AuthMiddleware, Authorize([SupportedPermissionsEnum.DELETE_PERMISSION]), ValidateRequest(PermissionSchemas.get, RequestParamsEnum.params)],
    (async (req: Request, res: Response, _next: NextFunction) => {
        const { id } = req.params
        const deletedPermission = await PermissionService.deletePermission(id)
        res.status(200).send({ success: true, data: deletedPermission })
    }) as RequestHandler)

    router.post('/seed', [AuthMiddleware, Authorize([SupportedPermissionsEnum.SEED_DATA])], (async (_req: Request, res: Response, _next: NextFunction) => {
        await PermissionService.seedPermissions()
        res.status(200).send({ success: true })
    }) as RequestHandler)

    return router
}
