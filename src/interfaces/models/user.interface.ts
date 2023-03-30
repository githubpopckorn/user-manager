import { type Document } from 'mongoose'
import { type IResetToken } from './resettoken.interface'
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
  loginAttempts: number
  locked: boolean
  lockUntil: number
  resetPasswordTokens: IResetToken[]
  resetPasswordAttemps: number
  resetPasswordLockUntil: number
  isCreator: boolean

  generateAuthToken: () => Promise<string>
  generatePasswordResetToken: () => Promise<string>
  comparePasswords: (password: string) => Promise<boolean>
}
