import {
  Controller,
  Get,
  Post,
  Param,
  Put,
  Body,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ChildrenService } from '../services/children.service';
import { Child } from '../entities/child.entity';
import { InsertResult } from 'typeorm';
import { CreateChildDto } from '../dto/children/createChild.dts';

@Controller('children')
export class ChildrenController {
  constructor(private readonly childService: ChildrenService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll(): Promise<Child[]> {
    return await this.childService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Child> {
    return await this.childService.findOne(id);
  }

  @Post()
  async create(@Body() child: CreateChildDto): Promise<InsertResult> {
    let result: InsertResult = await this.childService.create(child);

    // return await this.findOne(result.identifiers[0]);
    // return await this.childService.create(result);
    return result;
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() child: any): string {
    return 'this updates a chils';
  }

  @Delete(':id')
  remove(@Param('id') id: number): string {
    return 'child was removed';
  }
}
