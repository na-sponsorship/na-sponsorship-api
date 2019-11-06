import { Module } from '@nestjs/common';

import { StripeController } from './controllers/stripe.controller';
import { StripeService } from './services/vendors/stripe.service';
import { MailgunService } from './services/vendors/mailgun.service';
import { ChildrenService } from './services/children.service';
import { SponsorsService } from './services/sponsors.service';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Child } from '../../entities/child.entity';
import { Sponsor } from '../../entities/sponsor.entity';
import { CloudinaryService } from './services/vendors/cloudinary.service';
import { SentryLogger } from '../../../src/sentry.logger';
import { url } from 'inspector';
import { User } from '../auth/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        entities: [Child, Sponsor, User],
        migrations: [process.env.TYPEORM_MIGRATIONS],
        migrationsRun: process.env.TYPEORM_DEBUG as any,
      }),
    }),
    TypeOrmModule.forFeature([Child, Sponsor]),
  ],
  controllers: [StripeController],
  providers: [StripeService, MailgunService, CloudinaryService, ChildrenService, SponsorsService, SentryLogger],
  exports: [MailgunService, StripeService, CloudinaryService, ChildrenService, SponsorsService],
})
export class SharedModule {}
