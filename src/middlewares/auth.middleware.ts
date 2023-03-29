import { Request, NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { Config } from '../config';
import { HttpError } from "../exceptions/http.error";
import { IUser } from "../interfaces/models/user.interface";
import { User } from "../models";

export const AuthMiddleware = async (req: Request, _res: Response, next: NextFunction) => {
    try {
        if (!req.header('Authorization')) {
            const error = new HttpError(400, "Unauthorized");
            throw error;
        }

        const token = req.header('Authorization')!.replace('Bearer ', '');
        const decodedToken = jwt.verify(token, Config.JWT_SECRET) as {user: IUser };

        /** Buscar el usuario que viene en el token */
        const user = await User.findOne({ _id: decodedToken.user._id, 'tokens.token': token });
        if (!user) {
            const error = new HttpError(401, "Invalid token");
            throw error;
        }

        /** Agregar en el request los nuevos datos */
        req.user = user;
        req.token = token;

        /** Continuar con el siguiente middleware */
        next();
    } catch (error) {
        throw error;
    }
}