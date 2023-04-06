import { type Document } from 'mongoose'
import { type IPermission } from './permission.interface'

export interface IRole extends Document {
  name: string
  description: string
  permissions: IPermission[]
}
