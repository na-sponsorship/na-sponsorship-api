import { Logger } from 'typeorm';
import * as Sentry from '@sentry/node';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({
  path: path.resolve(process.cwd(), `environment.env`),
});

export class SentryLogger implements Logger {
  constructor() {
    Sentry.init({
      dsn: process.env.SENTRY_URL,
      environment: process.env.NODE_ENV,
    });
  }

  logQuery(
    query: string,
    parameters?: any[],
    queryRunner?: import('typeorm').QueryRunner,
  ) {
    Sentry.captureMessage(query, Sentry.Severity.Info);
  }

  logQueryError(
    error: string,
    query: string,
    parameters?: any[],
    queryRunner?: import('typeorm').QueryRunner,
  ) {
    Sentry.captureMessage(error, Sentry.Severity.Error);
  }

  logQuerySlow(
    time: number,
    query: string,
    parameters?: any[],
    queryRunner?: import('typeorm').QueryRunner,
  ) {
    Sentry.captureMessage(`(${time}) ${query}`, Sentry.Severity.Warning);
  }

  logSchemaBuild(message: string, queryRunner?: import('typeorm').QueryRunner) {
    Sentry.captureMessage(message, Sentry.Severity.Info);
  }

  logMigration(message: string, queryRunner?: import('typeorm').QueryRunner) {
    Sentry.captureMessage(message, Sentry.Severity.Info);
  }

  log(
    level: 'log' | 'info' | 'warn',
    message: any,
    queryRunner?: import('typeorm').QueryRunner,
  ) {
    Sentry.captureMessage(message, Sentry.Severity.Log);
  }
}
