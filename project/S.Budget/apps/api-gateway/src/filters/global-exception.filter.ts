import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

/** Cấu trúc response lỗi chuẩn */
export interface ErrorResponse {
  statusCode: number;
  message: string;
  error: string;
  timestamp: string;
  path: string;
}

/**
 * GlobalExceptionFilter — bắt tất cả exception và trả về response lỗi đồng nhất.
 *
 * Cấu trúc response:
 * {
 *   "statusCode": 400,
 *   "message": "Email already in use",
 *   "error": "Bad Request",
 *   "timestamp": "2025-04-28T04:00:00.000Z",
 *   "path": "/api/v1/auth/register"
 * }
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'Internal Server Error';

    if (exception instanceof HttpException) {
      // ── NestJS HTTP Exceptions (UnauthorizedException, etc.) ────────────────
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null
      ) {
        const resp = exceptionResponse as Record<string, unknown>;
        message = Array.isArray(resp['message'])
          ? (resp['message'] as string[]).join('; ')
          : (resp['message'] as string) || message;
      }

      error =
        exception.name.replace('Exception', '') ||
        this._statusToError(statusCode);
    } else if (
      exception !== null &&
      typeof exception === 'object' &&
      !(exception instanceof Error)
    ) {
      // ── Plain object từ RabbitMQ RPC (NestJS serialize RpcException thành object) ─
      const rpcObj = exception as Record<string, unknown>;
      if (
        typeof rpcObj['statusCode'] === 'number' &&
        typeof rpcObj['message'] === 'string'
      ) {
        statusCode = rpcObj['statusCode'];
        message = rpcObj['message'];
        error = this._statusToError(statusCode);
      } else if (typeof rpcObj['message'] === 'string') {
        // Thử parse JSON trong message
        const parsed = this._parseRpcError(rpcObj['message']);
        if (parsed) {
          statusCode = parsed.statusCode;
          message = parsed.message;
          error = this._statusToError(statusCode);
        } else {
          message = rpcObj['message'];
        }
      }
    } else if (exception instanceof Error) {
      // ── Error thông thường hoặc RpcException được wrap ──────────────────────
      const rpcError = this._parseRpcError(exception.message);
      if (rpcError) {
        statusCode = rpcError.statusCode;
        message = rpcError.message;
        error = this._statusToError(statusCode);
      } else {
        message = exception.message;
      }
    }

    const errorResponse: ErrorResponse = {
      statusCode,
      message,
      error,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    // Log lỗi 5xx
    if (statusCode >= 500) {
      this.logger.error(
        `[${request.method}] ${request.url} → ${statusCode}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    } else {
      this.logger.warn(
        `[${request.method}] ${request.url} → ${statusCode}: ${message}`,
      );
    }

    response.status(statusCode).json(errorResponse);
  }

  /** Map HTTP status code → error string */
  private _statusToError(status: number): string {
    const map: Record<number, string> = {
      400: 'Bad Request',
      401: 'Unauthorized',
      403: 'Forbidden',
      404: 'Not Found',
      409: 'Conflict',
      422: 'Unprocessable Entity',
      429: 'Too Many Requests',
      500: 'Internal Server Error',
      502: 'Bad Gateway',
      503: 'Service Unavailable',
    };
    return map[status] || 'Error';
  }

  /**
   * Parse lỗi từ RabbitMQ RPC (microservice trả về object lỗi dạng string).
   * NestJS microservice wraps RpcException thành Error với message là JSON.
   */
  private _parseRpcError(
    message: string,
  ): { statusCode: number; message: string } | null {
    try {
      const parsed = JSON.parse(message) as {
        statusCode?: number;
        message?: string;
      };
      if (parsed.statusCode && parsed.message) {
        return { statusCode: parsed.statusCode, message: parsed.message };
      }
    } catch {
      // Không phải JSON → bỏ qua
    }
    return null;
  }
}
