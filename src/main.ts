import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SentryLogger } from './sentry.logger';
import * as path from 'path';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: new SentryLogger(process.env.SENTRY_URL),
    bodyParser: true,
    cors: true,
  });
  const p = join(__dirname, '..', 'public');
  console.log(`public folder: ${p}`)
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useStaticAssets(p);
  await app.listen(process.env.PORT);
}
bootstrap();
