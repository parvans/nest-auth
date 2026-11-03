import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/db/schema';

type RequestWithUser = Request & { user: User };

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    return request.user;
  },
);
