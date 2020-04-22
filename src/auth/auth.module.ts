import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserRef, UserSchema } from './schemas';
import { LocalStrategy } from './strategies';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'jwt-secret',
      signOptions: {
        expiresIn: '60m',
      },
    }),
    MongooseModule.forFeature([
      {
        name: UserRef,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, UserService],
})
export class AuthModule {}
