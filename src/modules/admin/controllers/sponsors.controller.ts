import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Sponsor } from '../../../entities/sponsor.entity';
import { RolesGuard } from '../../auth/guards/roles.guard';

@UseGuards(AuthGuard())
@Controller('admin/sponsors')
export class SponsorsController {
  constructor(@InjectRepository(Sponsor) private readonly sponsorRepository: Repository<Sponsor>) {}

  @Get()
  async findAll(): Promise<Sponsor[]> {
    return await this.sponsorRepository.find({ relations: ['children'] });
  }
}
