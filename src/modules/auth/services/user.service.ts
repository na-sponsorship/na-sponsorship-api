import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findByUsername(username: string): Promise<User> {
    return await this.userRepository.findOne({
      where: {
        username,
      },
    });
  }

  async create(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }
}
