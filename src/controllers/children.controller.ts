import {
  Controller,
  Get,
  Param,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

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
  async needingSponsorship(): Promise<number> {
    return await this.childrenService.getChildrenNeedingSponsorship();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Child> {
    const child: Child = await this.childrenService.findOne(id);

    if (child.archived) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }

    return child;
  }
}
