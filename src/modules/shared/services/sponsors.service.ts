import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sponsor } from '../../../entities/sponsor.entity';
import { requestCodeDTO } from '../../../dto/sponsors/requestCode.dto';
import { VerifyCodeDTO } from '../../../dto/sponsors/verifyCode.dto';

@Injectable()
export class SponsorsService
 {
  constructor(
    @InjectRepository(Sponsor)
    private readonly sponsorRepository: Repository<Sponsor>,
  ) {}

  async findAll(): Promise<Sponsor[]> {
    return await this.sponsorRepository.find();
  }

  async findOne(id: number): Promise<Sponsor> {
    return await this.sponsorRepository.findOne(id);
  }

  // async create(sponsor: createSponsorDTO): Promise<InsertResult> {
  //   return await this.sponsorRepository.insert(sponsor);
  // }

  async generateCode(requestCodeDTO: requestCodeDTO): Promise<string> {
    console.log('generating random code')
    // 1 generate 6 digit code
    // 2 Save to db for user with the date it was generated
    return 'random code';
  }

  async maximumLoginAttemptsReached(verifyCodeDTO: VerifyCodeDTO): Promise<boolean> {
    // if login attempts is 5 return false
    return false;
  }

  async verifyCode(verifyCodeDTO: VerifyCodeDTO): Promise<boolean> {
    // 1 if code is valid return true and reset login attempts;
    // 2 if code is not-valid, increment the number of login  attempts
    return true;
  }
}
