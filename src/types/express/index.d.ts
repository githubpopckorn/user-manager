import { IUser } from "../../interfaces/models/user.interface";
export {}

declare global {
  namespace Express {
    export interface Request {
      user?: IUser;
    token: string;
    }
  }
}