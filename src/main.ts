import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SentryLogger } from './sentry.logger';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { ValidationPipe } from '@nestjs/common';

dotenv.config();
console.log(process.env.TYPEORM_USER);
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new SentryLogger(process.env.SENTRY_URL),
    bodyParser: true,
    cors: true,
  });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen(process.env.PORT);
}
bootstrap();
