import { type Document } from 'mongoose'
import { type IRole } from './role.interface'

export interface IUser extends Document {
  name: string
  email: string
  password: string
  username: string
  avatar: Buffer
  tokens: string[]
  hasAvatar: boolean
  roles: IRole[]

  generateAuthToken: () => Promise<string>
  comparePasswords: (password: string) => boolean
}
