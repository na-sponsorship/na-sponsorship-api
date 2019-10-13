import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SentryLogger } from './sentry.logger';
import { ValidationPipe, Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

const assetPath =
  process.env.NODE_ENV === 'local'
    ? join(__dirname, '..', 'public')
    : join(__dirname, '../../', 'public');

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: true,
    cors: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        strategy: 'excludeAll',
      },
    }),
  );
  app.useStaticAssets(assetPath);

  if (process.env.NODE_ENV === 'local') {
    app.useLogger(new Logger());
  } else {
    app.useLogger(new SentryLogger());
  }
  await app.listen(process.env.PORT);
}
bootstrap();
