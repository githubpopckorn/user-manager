import { Router, type Request, type RequestHandler, type Response } from 'express'
import { AuthMiddleware, Authorize } from '../middlewares'
import { type RoleService } from '../services/role.service'
import { SupportedPermissionsEnum } from '../config/constants'
import { ValidateRequest } from '../middlewares/validate-request.middleware'
import { RoleSchemas } from '../schemas'
import { RequestParamsEnum } from '../types/types'
export default ({ RoleService }: { RoleService: RoleService }): Router => {
  const router = Router()

  router.get('/',
  [AuthMiddleware, Authorize([SupportedPermissionsEnum.LIST_ROLES])],
  (async (req: Request, res: Response): Promise<void> => {
    const pageSize = parseInt(req.query.pageSize as string)
    const pageNum = parseInt(req.query.pageNum as string)
    const roles = await RoleService.getAll(pageSize, pageNum)
    res.status(200).send(roles)
  }) as RequestHandler)

  router.get('/:id',
  [AuthMiddleware, Authorize([SupportedPermissionsEnum.SEE_ROLE]), ValidateRequest(RoleSchemas.get, RequestParamsEnum.params)],
  (async (req: Request, res: Response) => {
    const { id } = req.params
    const role = await RoleService.getById(id)
    res.status(200).send(role)
  }) as RequestHandler)

  router.post('/',
  [AuthMiddleware, Authorize([SupportedPermissionsEnum.CREATE_ROLE]), ValidateRequest(RoleSchemas.role, RequestParamsEnum.body)],
  (async (req: Request, res: Response) => {
    const role = req.body
    const createdRole = await RoleService.createRole(role)
    res.status(201).send({ success: true, data: createdRole })
  }) as RequestHandler)

  router.patch('/:id',
  [AuthMiddleware, Authorize([SupportedPermissionsEnum.UPDATE_ROLE]), ValidateRequest(RoleSchemas.get, RequestParamsEnum.params), ValidateRequest(RoleSchemas.role, RequestParamsEnum.body)],
  (async (req: Request, res: Response) => {
    const { id } = req.params
    const role = req.body
    const updatedRole = await RoleService.update(id, role)
    res.status(200).send({ success: true, data: updatedRole })
  }) as RequestHandler)

  router.delete('/:id',
  [AuthMiddleware, Authorize([SupportedPermissionsEnum.DELETE_ROLE])],
  (async (req: Request, res: Response) => {
    const { id } = req.params
    await RoleService.deleteRole(id)
    res.status(200).send({ success: true, message: 'Role eliminado correctamente' })
  }) as RequestHandler)

  router.post('/:roleName/permissions/:permissionCode',
  [AuthMiddleware, Authorize([SupportedPermissionsEnum.ASSIGN_PERMISSIONS_TO_ROLES])],
  (async (req: Request, res: Response) => {
    const { roleName, permissionCode } = req.params
    const result = await RoleService.assignPermissionToRole(roleName, permissionCode)
    res.status(200).send({ success: result })
  }) as RequestHandler)

  router.delete('/:roleName/permissions/:permissionCode',
  [AuthMiddleware, Authorize([SupportedPermissionsEnum.REMOVE_PERMISSIONS_TO_ROLES])],
  (async (req: Request, res: Response) => {
    const { roleName, permissionCode } = req.params
    const result = await RoleService.removePermissionFromRole(roleName, permissionCode)
    res.status(200).send({ success: result })
  }) as RequestHandler)

  router.post('/seed',
  [AuthMiddleware, Authorize([SupportedPermissionsEnum.SEED_DATA])], (async (_req: Request, res: Response) => {
    await RoleService.seedRoles()
    res.status(200).send({ success: true })
  }) as RequestHandler)

  router.post('/permission/seed',
  [AuthMiddleware, Authorize([SupportedPermissionsEnum.SEED_DATA])],
  (async (_req: Request, res: Response) => {
    await RoleService.seedPermissionRole()
    res.status(200).send({ success: true })
  }) as RequestHandler)

  return router
}
