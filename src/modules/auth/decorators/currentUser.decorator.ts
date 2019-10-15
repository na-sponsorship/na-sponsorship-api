import { createParamDecorator } from '@nestjs/common';

export const CurrentUser = createParamDecorator((data, req: any) => {
  return req.user;
});
