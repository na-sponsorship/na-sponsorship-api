import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from 'nestjs-config';
import * as path from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from './modules/shared/shared.module';
import { RawBodyParserMiddleware } from './middleware/body-parser.middleware';

@Module({
  imports: [
    SharedModule,
    ConfigModule.load(path.resolve(__dirname, 'config', '**/!(*.d).{ts,js}')),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RawBodyParserMiddleware).forRoutes('stripe');
  }
}
