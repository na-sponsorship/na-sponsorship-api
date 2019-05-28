import { Logger } from '@nestjs/common';
import * as Sentry from '@sentry/node';

export class SentryLogger extends Logger {
    sentry: any;

    constructor(url: string) {
        super();

        this.sentry = Sentry.init({ dsn: 'https://2106ae1d85e34bb8bc215850549a49c4@sentry.io/1469226' });
    }

    log(message: string) {
        super.log(message);
    }
    error(message: string, trace: string) {
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
