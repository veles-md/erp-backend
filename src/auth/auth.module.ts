import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { UserModule } from 'src/user';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    // PassportModule,
    JwtModule.register({
      secret: 'jwt-secret',
      signOptions: {
        expiresIn: '60m',
      },
    }),
    UserModule,
  ],

  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
