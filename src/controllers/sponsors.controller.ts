import {
  Controller,
  Get,
  Post,
  Param,
  Put,
  Body,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { SponsorsService } from 'src/services/sponsors.service';
import { InsertResult } from 'typeorm';
import { createSponsorDTO } from 'src/dto/sponsors/createSponsor.dto';
import { Sponsor } from 'src/entities/sponsor.entity';
import { requestCodeDTO } from 'src/dto/sponsors/requestCode.dto';
import { MailerService } from 'src/modules/shared/services/mailer.service';
import { VerifyCodeDTO } from 'src/dto/sponsors/verifyCode.dto';

@Controller('sponsors')
export class SponsorsController {
  constructor(
    private readonly sponsorService: SponsorsService,
    private readonly mailerService: MailerService,
  ) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('/requestCode')
  async requestCode(@Body() requestCodeDTO: requestCodeDTO) {
    const code: string = await this.sponsorService.generateCode(requestCodeDTO);

    await this.mailerService.sendEmail(code);
    // schedule a task to remove the temp code to disable login (10 min?)
    return 'requesting code';
  }

  @Post('/verifyCode')
  async verifyCode(@Body() verifyCodeDTO: VerifyCodeDTO) {
    if (await this.sponsorService.maximumLoginAttemptsReached(verifyCodeDTO)) {
      return 'maximum login attempts';
    }

    return await this.sponsorService.verifyCode(verifyCodeDTO);
  }
}

