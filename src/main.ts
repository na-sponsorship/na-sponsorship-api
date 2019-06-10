import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SentryLogger } from './sentry.logger';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({
  path: path.resolve(process.cwd(), `environment.env`),
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new SentryLogger(process.env.SENTRY_URL),
    bodyParser: false,
  });
  await app.listen(3000);
}
bootstrap();
