import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { UserRef } from './schemas';
import { UserModel } from './interfaces';
import { CreateUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserRef) private readonly userModel: Model<UserModel>,
  ) {}

  async createUser(user: CreateUserDto): Promise<UserModel> {
    return await new this.userModel(user).save();
  }

  async updateUser(id: string, user: UpdateUserDto): Promise<UserModel> {
    return await this.userModel.findByIdAndUpdate(id, user, {
      new: true,
    });
  }

  async getUsers(): Promise<UserModel[]> {
    return await this.userModel.find({}).exec();
  }

  async removeUser(id: string): Promise<UserModel> {
    return await this.userModel.findByIdAndRemove(id).exec();
  }

  async findOne(username: string): Promise<UserModel> {
    return await this.userModel.findOne({ username: username }).exec();
  }
}
