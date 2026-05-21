import {
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { BaseRpcExceptionFilter, RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';

/**
 * AllRpcExceptionsFilter — bắt mọi exception trong microservice,
 * chuyển đổi thành RpcException có cấu trúc { statusCode, message }
 * để API Gateway có thể parse và trả về response lỗi chuẩn.
 *
 * Apply tại main.ts của từng microservice:
 *   app.useGlobalFilters(new AllRpcExceptionsFilter());
 */
@Catch()
export class AllRpcExceptionsFilter extends BaseRpcExceptionFilter {
  private readonly logger = new Logger(AllRpcExceptionsFilter.name);

  override catch(exception: unknown, host: ArgumentsHost): Observable<never> {
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      // ConflictException, UnauthorizedException, NotFoundException, ...
      statusCode = exception.getStatus();
      const resp = exception.getResponse();

      if (typeof resp === 'string') {
        message = resp;
      } else if (typeof resp === 'object' && resp !== null) {
        const r = resp as Record<string, unknown>;
        message = Array.isArray(r['message'])
          ? (r['message'] as string[]).join('; ')
          : (r['message'] as string) || exception.message;
      }
    } else if (exception instanceof RpcException) {
      // Đã là RpcException — trả về nguyên
      return super.catch(exception, host) as Observable<never>;
    } else if (exception instanceof Error) {
      message = exception.message;
      this.logger.error(exception.message, exception.stack);
    }

    // Log warn cho 4xx, error cho 5xx
    if (statusCode >= 500) {
      this.logger.error(`[RPC Error ${statusCode}] ${message}`);
    } else {
      this.logger.warn(`[RPC Error ${statusCode}] ${message}`);
    }

    // Throw RpcException với JSON payload để Gateway parse được
    return throwError(
      () => new RpcException(JSON.stringify({ statusCode, message })),
    );
  }
}
