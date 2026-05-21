import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * @Public() — đánh dấu route không yêu cầu JWT authentication.
 *
 * Mặc định tất cả routes đều cần auth.
 * Thêm decorator này để bypass JwtAuthGuard.
 *
 * @example
 *   @Public()
 *   @Post('register')
 *   register(...) { ... }
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
