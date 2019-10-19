import {
  Controller,
  Get,
  UseInterceptors,
  UseGuards,
  Post,
  UploadedFile,
  Body,
  Delete,
  Param,
  Put,
  Header,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
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

  @Get()
  async findAll(): Promise<Child[]> {
    return await this.childrenService.findAll();
  }

  @Get('/initStripe/:id')
  async initStripe(@Param('id') childId: number): Promise<Child> {
    const child: Child = await this.childRepository.findOne(childId);

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
    await this.childRepository.save(child);

    return child;
  }

  @Post()
  async create(@Body() childDto: CreateChildDTO): Promise<Child> {
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

    return newChild;
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('filepond'))
  async uploadImage(@UploadedFile() file, @Body('filepond') fileMetaRaw) {
    const fileMeta = JSON.parse(fileMetaRaw);
    const childId = get(fileMeta, 'child_id', null);

    const child = await this.childrenService.findOne(childId);

    // Delete previous image from cloudinary if it exists
    if (child.image) {
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

  @Put(':id')
  async update(
    @Param() id,
    @Body() updateChildDto: UpdateChildDTO,
  ): Promise<number> {
    await this.childRepository.update(id, updateChildDto);

    return updateChildDto.id;
  }

  @Get('/loadImage/:publicId')
  @Header('Content-Type', 'image/jpeg')
  @Header('Content-Disposition', 'attachment; filename=child.jpg')
  async loadImage(
    @Param('publicId') publicId: string,
    @Res() response,
  ): Promise<any> {
    const file = await this.cloudinaryService.getFile(publicId);

    file.pipe(response);
  }
}
