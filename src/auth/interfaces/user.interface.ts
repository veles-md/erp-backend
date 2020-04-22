import { Document } from 'mongoose';

export interface User {
  readonly username: string;
  readonly password: string;
}
export interface UserModel extends User, Document {}
