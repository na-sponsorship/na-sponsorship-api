import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository, InsertResult } from 'typeorm';
import { AddUserDTO } from '../dto/addUser.dto';
import { isUndefined } from 'lodash';

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

  async userExists(username: string): Promise<boolean> {
    const user: User = await this.findByUsername(username);

    return !isUndefined(user);
  }

  async create(user: AddUserDTO): Promise<InsertResult> {
    return await this.userRepository.insert(user);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async delete(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
