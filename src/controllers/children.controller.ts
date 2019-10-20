import {
  Controller,
  Get,
  Param,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query,
} from '@nestjs/common';
import { filter } from 'lodash';

import { ChildrenService } from '../modules/shared/services/children.service';
import { Child } from '../entities/child.entity';
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
    return await this.childrenService.paginate(
      {
        page,
        limit,
      },
      {
        where: {
          archived: false,
        },
      },
    );
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
}
