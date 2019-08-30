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

@UseGuards(AuthGuard())
@Controller('admin/children')
export class ChildrenController {
  constructor(
    private readonly childrenService: ChildrenService,
    private readonly stripeService: StripeService,
    private readonly cloudinaryService: CloudinaryService,
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
    const childId: number = (await this.childrenService.create(childDto))
      .identifiers[0].id;

    const child: Child = await this.childrenService.findOne(childId);

    const product: Stripe.products.IProductCreationOptions = {
      name: `${child.firstName} ${child.lastName} (Child)`,
      type: 'service',
    };

    // Create product
    const stripeProductId: string = await this.stripeService.createProduct(
      product,
    );

    // Add Pricing plan
    await this.stripeService.addPricingPlan(3900, stripeProductId);

    // Update DB with strip Product
    child.stripeProduct = stripeProductId;
    await this.childrenService.save(child);

    return child.id;
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('filepond'))
  async uploadImage(@UploadedFile() file, @Body('filepond') fileMeta) {
    const childId = get(JSON.parse(fileMeta), 'child-id', -1);
    const child = await this.childrenService.findOne(childId);

    child.image = file.public_id;

    await this.childrenService.save(child);
  }

  @Delete(':id')
  async delete(@Param() params) {
    const child: Child = await this.childrenService.findOne(params.id);

    await this.cloudinaryService.destroy(child.image);

    return await this.childrenService.removeById(params.id);
  }
}
