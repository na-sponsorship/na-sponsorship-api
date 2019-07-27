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
  Query,
} from '@nestjs/common';
import { InsertResult } from 'typeorm';
import { filter } from 'lodash';

import { ChildrenService } from '../modules/shared/services/children.service';
import { Child } from '../entities/child.entity';
import { CreateChildDTO } from '../dto/children/createChild.dto';
import { Pagination } from 'nestjs-typeorm-paginate';

@Controller('children')
export class ChildrenController {
  constructor(private readonly childrenService: ChildrenService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll(
    @Query('page') page: number = 0,
    @Query('limit') limit: number = 6,
  ): Promise<Pagination<Child>> {
    return await this.childrenService.paginate({
      page,
      limit,
    });
  }

  @Get('/needingSponsorship')
  async needingSponsorship() {
    const children: Child[] = await this.childrenService.findAll();

    return filter(
      children,
      (child: Child) => child.activeSponsors < child.sponsorsNeeded,
    ).length;
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Child> {
    return await this.childrenService.findOne(id);
  }

  @Post()
  async create(@Body() child: CreateChildDTO): Promise<InsertResult> {
    const result: InsertResult = await this.childrenService.create(child);

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
