import { type IRole } from './role.interface'

export interface IPermission {
    name: string
    code: string
    description: string
    roles?: IRole[]
}
