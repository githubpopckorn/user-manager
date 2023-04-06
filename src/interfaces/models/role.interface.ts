import { type Document } from 'mongoose'
import { type IPermission } from './permission.interface'
import { type IUser } from './user.interface'

export interface IRole extends Document {
  name: string
  description: string
  permissions: IPermission[]
  users?: IUser[]
}
