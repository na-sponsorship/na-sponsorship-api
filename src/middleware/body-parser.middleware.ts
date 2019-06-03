import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { raw } from 'body-parser';

@Injectable()
export class RawBodyParserMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: () => void) {
        raw({ type: 'application/json' })(req, res, next);
    }
}
