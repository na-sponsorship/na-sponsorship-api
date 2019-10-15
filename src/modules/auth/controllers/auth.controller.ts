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
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../services/auth.service';
import { User } from '../entities/user.entity';
import { UserService } from '../services/user.service';
import { AddUserDTO } from '../dto/addUser.dto';
import { InsertResult } from 'typeorm';
import { CurrentUser } from '../decorators/currentUser.decorator';

@Controller('admin/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req): Promise<any> {
    return this.authService.login(req.user);
  }

  @UseGuards(AuthGuard())
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('/register')
  async register(@Body() addUserDto: AddUserDTO): Promise<InsertResult> {
    const user: User = new User();
    user.username = addUserDto.username;
    user.password = addUserDto.password;

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

  @UseGuards(AuthGuard())
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/users')
  async findAll(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @UseGuards(AuthGuard())
  @Get('/users/:id')
  async delete(
    @CurrentUser() currentUser: User,
    @Param('id') deleteId: number,
  ) {
    if (currentUser.id === Number(deleteId)) {
      throw new HttpException(`Can't delete own account`, HttpStatus.FORBIDDEN);
    }

    await this.userService.delete(deleteId);
  }
}
