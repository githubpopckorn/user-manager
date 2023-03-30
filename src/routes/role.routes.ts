import { type RequestHandler, Router, type Request, type Response } from 'express'
import { AuthMiddleware, AuthorizeRole } from '../middlewares'
import { type RoleService } from '../services/role.service'
import { SupportedRolesEnum } from '../types/types'
export default ({ RoleService }: { RoleService: RoleService }): Router => {
  const router = Router()

  router.get('/', [AuthMiddleware, AuthorizeRole([SupportedRolesEnum.ADMIN])], (async (req: Request, res: Response): Promise<void> => {
    const pageSize = parseInt(req.query.pageSize as string)
    const pageNum = parseInt(req.query.pageNum as string)
    const roles = await RoleService.getAll(pageSize, pageNum)
    res.status(200).send(roles)
  }) as RequestHandler)

  router.get('/:id', [AuthMiddleware], (async (req: Request, res: Response) => {
    const { id } = req.params
    const role = await RoleService.getById(id)
    res.status(200).send(role)
  }) as RequestHandler)

  router.post('/', [AuthMiddleware], (async (req: Request, res: Response) => {
    const role = req.body
    const createdRole = await RoleService.createRole(role)
    res.status(201).send(createdRole)
  }) as RequestHandler)

  router.patch('/:id', [AuthMiddleware], (async (req: Request, res: Response) => {
    const { id } = req.params
    const role = req.body
    const updatedRole = await RoleService.update(id, role)
    res.status(200).send(updatedRole)
  }) as RequestHandler)

  router.delete('/:id', [AuthMiddleware], (async (req: Request, res: Response) => {
    const { id } = req.params
    const deletedRole = await RoleService.delete(id)
    res.status(200).send(deletedRole)
  }) as RequestHandler)

  return router
}
