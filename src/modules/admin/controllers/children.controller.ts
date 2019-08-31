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
  Delete,
  Param,
  Put,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Pagination } from 'nestjs-typeorm-paginate';
import { AuthGuard } from '@nestjs/passport';
import { get } from 'lodash';
import * as Stripe from 'stripe';

import { Child } from '../../../entities/child.entity';
import { ChildrenService } from '../../../modules/shared/services/children.service';
import { CreateChildDTO } from '../dto/children/createChild.dto';
import { StripeService } from '../../shared/services/vendors/stripe.service';
import { CloudinaryService } from '../../shared/services/vendors/cloudinary.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateChildDTO } from '../dto/children/updateChild.dto';

@UseGuards(AuthGuard())
@Controller('admin/children')
export class ChildrenController {
  constructor(
    private readonly childrenService: ChildrenService,
    private readonly stripeService: StripeService,
    private readonly cloudinaryService: CloudinaryService,
    @InjectRepository(Child)
    private readonly childRepository: Repository<Child>,
  ) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll(
    @Query('page') page: number = 0,
    @Query('limit') limit: number = 10,
  ): Promise<Pagination<Child>> {
    return await this.childrenService.paginate({ page, limit });
  }

  @Post()
  async create(@Body() childDto: CreateChildDTO): Promise<number> {
    const newChild: Child = await this.childRepository.create(childDto);

    const product: Stripe.products.IProductCreationOptions = {
      name: `${newChild.firstName} ${newChild.lastName} (Child)`,
      type: 'service',
    };

    // Create product
    const stripeProductId: string = await this.stripeService.createProduct(
      product,
    );

    // Add Pricing plan
    await this.stripeService.addPricingPlan(3900, stripeProductId);

    // Update DB with strip Product
    newChild.stripeProduct = stripeProductId;
    await this.childRepository.save(newChild);

    return this.childRepository.getId(newChild);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('filepond'))
  async uploadImage(@UploadedFile() file, @Body('filepond') fileMetaRaw) {
    const fileMeta = JSON.parse(fileMetaRaw);
    const childId = get(fileMeta, 'child-id', -1);
    const isEditing = get(fileMeta, 'is-editing', false);

    const child = await this.childrenService.findOne(childId);

    if (isEditing) {
      // Delete previous image from cloudinary
      this.cloudinaryService.destroy(child.image);
    }

    child.image = file.public_id;

    await this.childrenService.save(child);
  }

  @Delete(':id')
  async delete(@Param() params) {
    const child: Child = await this.childrenService.findOne(params.id);

    await this.cloudinaryService.destroy(child.image);

    return await this.childrenService.removeById(params.id);
  }

  @Put()
  async update(@Body() updateChildDto: UpdateChildDTO): Promise<number> {
    await this.childRepository.update(updateChildDto.id, updateChildDto);

    return updateChildDto.id;
  }
}
