import { type IUser } from '../interfaces/models/user.interface'
import { BaseRepository } from './base.repository'
import { type Model } from 'mongoose'

export class UserRepository extends BaseRepository<IUser> {
  user: Model<IUser>

  constructor ({ UserModel }: { UserModel: Model<IUser> }) {
    super(UserModel)
    this.user = UserModel
  }

  async getUserByUsername (username: string): Promise<IUser | null> {
    return await this.user.findOne({ username }).populate({
      path: 'roles',
      options: { autopopulate: true }
    })
  }

  async findUserByEmail (email: string): Promise<IUser | null> {
    return await this.user.findOne({ email })
  }
}
