import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SentryLogger } from './sentry.logger';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new SentryLogger(process.env.sentry_url),
    bodyParser: false,
  });
  await app.listen(3000);
}
bootstrap();
