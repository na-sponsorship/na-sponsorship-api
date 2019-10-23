import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from './user.service';
import { User } from '../entities/user.entity';
import { IAuthToken } from '../interfaces/auth-token.interface';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {}

  async validateUser(username: string, password: string): Promise<User> | null {
    const user: User = await this.userService.findByUsername(username);

    if (user && user.password) {
      const correctPassword = await bcrypt.compare(password, user.password);

      return correctPassword ? user : null;
    }

    return null;
  }

  async login(user: User): Promise<any> {
    const payload: IAuthToken = {
      username: user.username,
      name: user.name,
      id: user.id,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
