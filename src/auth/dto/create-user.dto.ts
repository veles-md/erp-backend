import { IsString } from 'class-validator';

import { User } from '../interfaces';

export class CreateUserDto implements User {
  @IsString()
  readonly username: string;
  @IsString()
  readonly password: string;
}
