import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SentryLogger } from './sentry.logger';
import * as path from 'path';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

const assetPath =
  process.env.NODE_ENV === 'local'
    ? join(__dirname, '..', 'public')
    : join(__dirname, '../../', 'public');

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: new SentryLogger(process.env.SENTRY_URL),
    bodyParser: true,
    cors: true,
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useStaticAssets(assetPath);
  await app.listen(process.env.PORT);
}
bootstrap();
