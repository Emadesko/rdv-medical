import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { PayloadInterface } from '../dto/responses/payload.interface';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): PayloadInterface => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
