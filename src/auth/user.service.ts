import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { UserRef } from './schemas';
import { UserModel } from './interfaces';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserRef) private readonly userModel: Model<UserModel>,
  ) {}

  async findOne(username: string): Promise<UserModel> {
    return await this.userModel.findOne({ username: username }).exec();
  }
}
