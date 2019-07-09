import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Child } from '../entities/child.entity';
import { Repository, InsertResult } from 'typeorm';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { CreateChildDTO } from '../dto/children/createChild.dto';

@Injectable()
export class ChildrenService {
  constructor(
    @InjectRepository(Child)
    private readonly childRepository: Repository<Child>,
  ) {}

  async paginate(options: IPaginationOptions): Promise<Pagination<Child>> {
    return await paginate<Child>(this.childRepository, options);
  }
  async findAll(): Promise<Child[]> {
    return await this.childRepository.find();
  }

  async findOne(id: number): Promise<Child> {
    return await this.childRepository.findOne(id);
  }

  async create(child: CreateChildDTO): Promise<InsertResult> {
    return await this.childRepository.insert(child);
  }

  async update(id: number, child: Child): Promise<Child> {
    return null;
  }

  async remove(id: number): Promise<Child> {
    return null;
  }
}
