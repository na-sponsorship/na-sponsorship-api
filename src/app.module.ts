import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
// import  * as dotenv  from "dotenv";

import { SharedModule } from './modules/shared/shared.module';
import { RawBodyParserMiddleware } from './middleware/body-parser.middleware';
import { ChildrenController } from './controllers/children.controller';
import { ChildrenService } from './modules/shared/services/children.service';
import { Child } from './entities/child.entity';
import { Sponsor } from './entities/sponsor.entity';
import { SponsorsController } from './controllers/sponsors.controller';
import { SponsorsService } from './modules/shared/services/sponsors.service';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [SharedModule, AdminModule],
  controllers: [ChildrenController, SponsorsController],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RawBodyParserMiddleware).forRoutes('stripe');
  }
}
