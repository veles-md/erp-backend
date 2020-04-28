import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Delete,
  Param,
  Put,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards';
import { UserModel } from './interfaces';
import { CreateUserDto, UpdateUserDto } from './dto';
import { UserService } from './user.service';

@Controller('/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  async login(@Body() credentials: any) {
    return this.authService.login(credentials);
  }

  @Post('/users')
  async createUser(@Body() user: CreateUserDto): Promise<UserModel> {
    return await this.userService.createUser(user);
  }
  @Get('/users')
  async getUsers(): Promise<UserModel[]> {
    return await this.userService.getUsers();
  }
  @Delete('/users/:id')
  async removeUser(@Param('id') id: string): Promise<UserModel> {
    return await this.userService.removeUser(id);
  }
  @Put('/users/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() user: UpdateUserDto,
  ): Promise<UserModel> {
    return await this.userService.updateUser(id, user);
  }
}
