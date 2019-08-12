import {
  Controller,
  Get,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query,
  UseGuards,
  Post,
  UploadedFile,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Pagination } from 'nestjs-typeorm-paginate';
import { AuthGuard } from '@nestjs/passport';
import { InsertResult } from 'typeorm';
import { get } from 'lodash';

import { Child } from '../../../entities/child.entity';
import { ChildrenService } from '../../../modules/shared/services/children.service';
import { CreateChildDTO } from '../dto/children/createChild.dto';

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

  @Post()
  async create(@Body() child: CreateChildDTO): Promise<InsertResult> {
    const result: InsertResult = await this.childrenService.create(child);

    return result.identifiers[0].id;
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('filepond'))
  async uploadImage(@UploadedFile() file, @Body('filepond') fileMeta) {
    const childId = get(JSON.parse(fileMeta), 'child-id', -1);
    const child = await this.childrenService.findOne(childId);

    child.image =
      process.env.NODE_ENV === 'local'
        ? `http://0.0.0.0:${process.env.PORT}/${file.filename}`
        : file.location;

    await this.childrenService.save(child);
  }
}
