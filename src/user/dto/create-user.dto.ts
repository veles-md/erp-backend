import { IsString } from 'class-validator';

import { IUser } from '../interfaces';

export class CreateUserDto implements IUser {
  @IsString()
  readonly email: string;
  @IsString()
  readonly password: string;
}
