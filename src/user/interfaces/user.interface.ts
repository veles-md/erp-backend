import { Document } from 'mongoose';

export interface IUser {
  readonly email: string;
  readonly password: string;
}
export interface IUserModel extends IUser, Document {}
