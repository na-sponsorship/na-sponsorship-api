import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
// import  * as dotenv  from "dotenv";

import { SharedModule } from './modules/shared/shared.module';
import { RawBodyParserMiddleware } from './middleware/body-parser.middleware';
import { ChildrenController } from './controllers/children.controller';
import { ChildrenService } from './services/children.service';
import { Child } from './entities/child.entity';
import { Sponsor } from './entities/sponsor.entity';
import { SponsorsController } from './controllers/sponsors.controller';
import { SponsorsService } from './services/sponsors.service';

@Module({
  imports: [
    SharedModule,
    TypeOrmModule.forRoot(),
    TypeOrmModule.forFeature([Child, Sponsor]),
  ],
  controllers: [ChildrenController, SponsorsController],
  providers: [ChildrenService, SponsorsService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RawBodyParserMiddleware).forRoutes('stripe');
  }
}
