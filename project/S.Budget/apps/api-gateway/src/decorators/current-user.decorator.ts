import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IJwtPayload } from '@app/shared/interfaces';

/**
 * @CurrentUser() — trích xuất JWT payload đã decode từ request context.
 *
 * Sử dụng trong controller:
 *   @Get()
 *   findAll(@CurrentUser() user: IJwtPayload) { ... }
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): IJwtPayload => {
    const request = ctx
      .switchToHttp()
      .getRequest<Request & { user: IJwtPayload }>();
    return request.user;
  },
);
