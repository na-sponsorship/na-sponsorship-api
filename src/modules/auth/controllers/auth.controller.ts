import {
  Controller,
  UseGuards,
  Post,
  Request,
  Get,
  Body,
  UseInterceptors,
  ClassSerializerInterceptor,
  Param,
  HttpException,
  HttpStatus,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from '../services/auth.service';
import { User } from '../entities/user.entity';
import { UserService } from '../services/user.service';
import { AddUserDTO } from '../dto/addUser.dto';
import { CurrentUser } from '../decorators/currentUser.decorator';
import { Roles } from '../decorators/roles.decorators';
import { UserRole } from '../roles.enum';
import { RolesGuard } from '../guards/roles.guard';

@Controller('admin/auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly userService: UserService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req): Promise<any> {
    return this.authService.login(req.user);
  }

  @UseGuards(AuthGuard(), RolesGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('/register')
  @Roles(UserRole.ADMIN)
  async register(@Body() user: AddUserDTO): Promise<User> {
    // Check if this user exists
    if (!(await this.userService.userExists(user.username))) {
      return await this.userService.create(user);
    } else {
      throw new HttpException('User Exists', HttpStatus.FORBIDDEN);
    }
  }

  @UseGuards(AuthGuard())
  @Get('/me')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(AuthGuard(), RolesGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/users')
  @Roles(UserRole.ADMIN)
  async findAll(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @UseGuards(AuthGuard(), RolesGuard)
  @Delete('/users/:id')
  @Roles(UserRole.ADMIN)
  async delete(@CurrentUser() currentUser: User, @Param('id') deleteId: number) {
    if (currentUser.id === Number(deleteId)) {
      throw new HttpException(`Can't delete own account`, HttpStatus.FORBIDDEN);
    }

    await this.userService.delete(deleteId);
  }
}
