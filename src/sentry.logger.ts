import { Logger, Injectable } from '@nestjs/common';
import * as Sentry from '@sentry/node';

@Injectable()
export class SentryLogger extends Logger {
  sentry: any;

  constructor() {
    super();

    Sentry.init({
      dsn: process.env.SENTRY_URL,
      environment: process.env.NODE_ENV,
    });
  }

  sentryLog(message: string, severity: Sentry.Severity) {
    if (process.env.NODE_ENV === 'local') {
      switch (severity) {
        case Sentry.Severity.Log:
          super.log(message);
          break;
        case Sentry.Severity.Warning:
          super.warn(message);
          break;
        case Sentry.Severity.Debug:
          super.debug(message);
          break;
      }
      return;
    }

    Sentry.withScope(scope => {
      scope.setLevel(severity);

      Sentry.captureMessage(message);
    });
  }

  log(message: string) {
    this.sentryLog(message, Sentry.Severity.Log);
  }
  error(message: string, trace: string) {
    if (process.env.NODE_ENV === 'local') {
      super.error(message, trace);
      return;
    }

    Sentry.captureException(new Error(message));
  }
  warn(message: string) {
    this.sentryLog(message, Sentry.Severity.Warning);
  }
  debug(message: string) {
    this.sentryLog(message, Sentry.Severity.Debug);
  }
  verbose(message: string) {
    this.sentryLog(message, Sentry.Severity.Debug);
  }
}
