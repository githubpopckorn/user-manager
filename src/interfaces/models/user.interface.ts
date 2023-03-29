import { Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  username: string;
  avatar: Buffer;
  tokens: string[];
  hasAvatar: boolean;

  generateAuthToken(): string;
  comparePasswords(password: string): boolean;
}