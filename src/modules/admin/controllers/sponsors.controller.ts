import { Controller, Get, UseInterceptors, UseGuards, Post, UploadedFile, Body, Delete, Param, Put, Header, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { get, each } from 'lodash';
import * as Stripe from 'stripe';

import { Child } from '../../../entities/child.entity';
import { ChildrenService } from '../../shared/services/children.service';
import { CreateChildDTO } from '../dto/children/createChild.dto';
import { StripeService } from '../../shared/services/vendors/stripe.service';
import { CloudinaryService } from '../../shared/services/vendors/cloudinary.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateChildDTO } from '../dto/children/updateChild.dto';
import { Sponsor } from 'src/entities/sponsor.entity';

@UseGuards(AuthGuard())
@Controller('admin/sponsors')
export class SponsorsController {
  constructor(@InjectRepository(Sponsor) private readonly sponsorRepository: Repository<Sponsor>) {}

  @Get()
  async findAll(): Promise<Sponsor[]> {
    return await this.sponsorRepository.find({ relations: ['children'] });
  }
}
