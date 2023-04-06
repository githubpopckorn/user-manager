import { type IRole } from '../../interfaces/models/role.interface'
import { type IUser } from '../../interfaces/models/user.interface'
import { type IPermission } from '../../interfaces/models/permission.interface'
export {}

declare global {
  namespace Express {
    export interface Request {
      user?: IUser
      token: string
      roles: IRole[]
      permissions: IPermission[]
    }
  }
}
