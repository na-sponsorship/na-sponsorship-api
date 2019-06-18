import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Child } from '../entities/child.entity';
import { Repository, InsertResult } from 'typeorm';
import { CreateChildDto } from '../dto/children/createChild.dts';

@Injectable()
export class ChildrenService {
  constructor(
    @InjectRepository(Child)
    private readonly childRepository: Repository<Child>,
  ) {}

  async findAll(): Promise<Child[]> {
    return await this.childRepository.find();
  }

  async findOne(id: number): Promise<Child> {
    return await this.childRepository.findOne(id);
  }

  async create(child: CreateChildDto): Promise<InsertResult> {
    return await this.childRepository.insert(child);
  }

  async update(id: number, child: Child): Promise<Child> {
    return null;
  }

  async remove(id: number): Promise<Child> {
    return null;
  }
}
