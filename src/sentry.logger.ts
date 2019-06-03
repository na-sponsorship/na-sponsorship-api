import { Logger } from '@nestjs/common';
import * as Sentry from '@sentry/node';

export class SentryLogger extends Logger {
    sentry: any;

    constructor(url: string) {
        super();

        Sentry.init({ dsn: url, environment: process.env.NODE_ENV });
    }

    log(message: string) {
        super.log(message);
    }
    error(message: string, trace: string) {
        Sentry.captureException(new Error(message));
        super.error(message, trace);
    }
    warn(message: string) {
        super.warn(message);
    }
    debug(message: string) {
        super.debug(message);
    }
    verbose(message: string) {
        super.verbose(message);
    }
}
