import { Controller, Post, Body } from '@nestjs/common';

import { AuthService } from './auth.service';
import { SignInDto } from './dto';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  async login(@Body() credentials: SignInDto) {
    return this.authService.signIn(credentials);
  }
}
