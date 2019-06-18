import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from 'nestjs-config';
import * as path from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from './modules/shared/shared.module';
import { RawBodyParserMiddleware } from './middleware/body-parser.middleware';
import { ChildrenController } from './controllers/children.controller';
import { ChildrenService } from './services/children.service';
import { Child } from './entities/child.entity';

@Module({
  imports: [
    SharedModule,
    ConfigModule.load(path.resolve(__dirname, 'config', '**/!(*.d).{ts,js}')),
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => {
        return config.get('database');
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Child]),
  ],
  controllers: [AppController, ChildrenController],
  providers: [AppService, ChildrenService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RawBodyParserMiddleware).forRoutes('stripe');
  }
}
