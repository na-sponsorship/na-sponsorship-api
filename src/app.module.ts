import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';

import { RawBodyParserMiddleware } from './middleware/body-parser.middleware';
import { ChildrenController } from './controllers/children.controller';
import { SponsorsController } from './controllers/sponsors.controller';
import { SharedModule } from './modules/shared/shared.module';
import { AdminModule } from './modules/admin/admin.module';
import { AppController } from './controllers/app.controller';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'uploads'),
    }),
    SharedModule,
    AdminModule,
  ],
  controllers: [AppController, ChildrenController, SponsorsController],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RawBodyParserMiddleware).forRoutes('stripe');
  }
}
