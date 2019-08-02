import {
  Controller,
  Get,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Child } from '../../../entities/child.entity';
import { ChildrenService } from '../../../modules/shared/services/children.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard())
@Controller('admin/children')
export class ChildrenController {
  constructor(private readonly childrenService: ChildrenService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll(
    @Query('page') page: number = 0,
    @Query('limit') limit: number = 10,
  ): Promise<Pagination<Child>> {
    return await this.childrenService.paginate({ page, limit });
  }
}
