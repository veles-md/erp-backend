import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserService } from './user.service';
import { UserRef, UserSchema } from './schemas';

@Module({
  imports: [MongooseModule.forFeature([{ name: UserRef, schema: UserSchema }])],
  controllers: [],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
