import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserService } from 'src/user';

import { SignInDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(credentials: SignInDto) {
    const user = await this.userService.findOneByEmail(credentials.email);

    if (user && user.password === credentials.password) {
      const { password, ...payload } = user;
      return this.jwtService.sign(payload);
    }
    throw new UnauthorizedException();
  }
}
