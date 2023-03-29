import { IUser } from '../interfaces/models/user.interface';
import { BaseRepository } from './base.repository';
import { Model } from 'mongoose';


export class UserRepository extends BaseRepository<IUser> {
    user: Model<IUser>;
    constructor({ UserModel }: { UserModel: Model<IUser> }) {
        super(UserModel);
        this.user = UserModel;
    }

    async getUserByUsername(username: string) {
        return this.user.findOne({ username })
    }

    async findUserByEmail(email: string) {
        return await this.user.findOne({ email });
    }
}

