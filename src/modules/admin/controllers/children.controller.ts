import { Controller, Get, UseInterceptors, UseGuards, Post, UploadedFile, Body, Delete, Param, Put, Header, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { get, each } from 'lodash';
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

  @Post()
  async create(@Body() childDto: CreateChildDTO): Promise<Child> {
    const newChild: Child = await this.childRepository.create(childDto);

    const product: Stripe.products.IProductCreationOptions = {
      name: `${newChild.firstName} ${newChild.lastName} (Child)`,
      type: 'service',
    };

    // Create product
    const stripeProductId: string = await this.stripeService.createProduct(product);

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

  @Post('archive/:id')
  async archive(@Param('id') id) {
    const child: Child = await this.childrenService.findOne(id);

    child.archived = true;

    await this.childrenService.save(child);
  }

  @Post('unarchive/:id')
  async unarchive(@Param('id') id) {
    const child: Child = await this.childrenService.findOne(id);

    child.archived = false;

    await this.childrenService.save(child);
  }

  @Delete(':id')
  async delete(@Param('id') id) {
    const child: Child = await this.childrenService.findOne(id);

    const product: Stripe.products.IProduct = await this.stripeService.findProductById(child.stripeProduct);
    const plans: Stripe.IList<Stripe.plans.IPlan> = await this.stripeService.findPlansByProductId(child.stripeProduct);

    // 1. Delete Child
    await this.childrenService.remove(child);

    for (const PLAN_INDEX in plans.data) {
      if (plans.data.hasOwnProperty(PLAN_INDEX)) {
        const plan: Stripe.plans.IPlan = plans.data[PLAN_INDEX];
        const subscriptions: Stripe.IList<Stripe.subscriptions.ISubscription> = await this.stripeService.findSubscriptionsByPlanId(plan.id);

        // 2. Delete Child's pricing plan
        await this.stripeService.deletePricingPlan(plan);

        // 2.1 Cancel all product's active subscriptions
        for (const SUBSCRIPTION_INDEX in subscriptions.data) {
          if (plans.data.hasOwnProperty(SUBSCRIPTION_INDEX)) {
            await this.stripeService.cancelSubscription(subscriptions.data[SUBSCRIPTION_INDEX]);
          }
        }
      }
    }

    /**
     * @TOOD Need to implement
     */
    // 3. Notify affected sponsors that their sponsorship has been terminated

    // 4. Delete product
    await this.stripeService.deleteProduct(product);

    // 5. Remove Child's image from cloudinary
    if (child.image) {
      await this.cloudinaryService.destroy(child.image);
    }
  }

  @Put(':id')
  async update(@Param() id, @Body() updateChildDto: UpdateChildDTO): Promise<number> {
    await this.childRepository.update(id, updateChildDto);

    return updateChildDto.id;
  }

  @Get('/loadImage/:publicId')
  @Header('Content-Type', 'image/jpeg')
  @Header('Content-Disposition', 'attachment; filename=child.jpg')
  async loadImage(@Param('publicId') publicId: string, @Res() response): Promise<any> {
    const file = await this.cloudinaryService.getFile(publicId);

    file.pipe(response);
  }
}
