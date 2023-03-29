import { HttpError } from '../exceptions/http.error';
import { IUser } from '../interfaces/models/user.interface';
import { UserRepository } from '../repositories';
import { BaseService } from './base.service';


export class UserService extends BaseService {
    userRepository: UserRepository;

    constructor({ UserRepository }: { UserRepository: UserRepository }) {
        super(UserRepository);
        this.userRepository = UserRepository;
    }

    async signUp(user: IUser) {
        const { email } = user;

        //** Comprobar si el usuario ya esta registrado en la base de datos */
        const userExist = await this.userRepository.findUserByEmail(email);
        if (userExist) {
            const error = new HttpError(400, "El usuario ya se encuentra registrado");
            throw error;
        }

        /** Crear el usuario  */
        const createdUser = await this.userRepository.create(user);

        const token = await createdUser.generateAuthToken();
        return { createdUser, token }
    }

    async signIn(email: string, password: string) {
        try {
            const user = await this.userRepository.findUserByEmail(email);
            if (!user) {
                const error = new HttpError(400, "Correo o clave incorrecto");
                throw error;
            }

            const isMatch = user.comparePasswords(password);
            if (!isMatch) {
                const error = new HttpError(400, "Correo o clave incorrecto");
                throw error;
            }
                
            const token = await user.generateAuthToken();
            return { user, token };

        } catch (error) {
            throw error;
        }
    }

    async signOut(user: IUser, token: string) {
        user.tokens = user.tokens.filter((t: string) => t !== token);
        await user.save();
        return true;
    }

    async signOutAll(user: IUser) {
        user.tokens = [];
        await user.save();
        return true;
    }
}