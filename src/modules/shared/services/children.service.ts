import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Child } from '../../../entities/child.entity';
import { Repository, InsertResult } from 'typeorm';
import * as Stripe from 'stripe';

import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { CreateChildDTO } from '../../../dto/children/createChild.dto';
import { StripeService } from './vendors/stripe.service';

@Injectable()
export class ChildrenService {
  constructor(
    @InjectRepository(Child)
    private readonly childRepository: Repository<Child>,
    private readonly stripeService: StripeService,
  ) {}

  async paginate(options: IPaginationOptions, searchOptions?: any): Promise<Pagination<Child>> {
    return await paginate<Child>(this.childRepository, options, searchOptions);
  }
  async findAll(): Promise<Child[]> {
    return await this.childRepository.find();
  }

  async findOne(id: number): Promise<Child> {
    return await this.childRepository.findOne(id);
  }

  async create(child: CreateChildDTO): Promise<InsertResult> {
    return await this.childRepository.insert(child);
  }

  async save(child: Child) {
    await this.childRepository.save(child);
  }

  async remove(child: Child) {
    await this.childRepository.remove(child);
  }

  async removeById(id: number) {
    const child = await this.childRepository.findOne(id);

    return await this.childRepository.remove(child);
  }

  async getPricingPlan(child: Child): Promise<Stripe.plans.IPlan> {
    const stripePlans: Stripe.IList<
      Stripe.plans.IPlan
    > = await this.stripeService.getPlans(child.stripeProduct);

    return stripePlans.data[0];
  }
}
