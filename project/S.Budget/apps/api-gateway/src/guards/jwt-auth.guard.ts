import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { IJwtPayload } from '@app/shared/interfaces';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    // Kiểm tra route có @Public() không → bypass
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    // Lấy token từ Authorization header
    const request = context
      .switchToHttp()
      .getRequest<Request & { user: IJwtPayload }>();
    const token = this._extractToken(request);

    if (!token) {
      throw new UnauthorizedException('Access token is missing');
    }

    // Verify và decode token
    try {
      const payload = this.jwtService.verify<IJwtPayload>(token, {
        secret: process.env['JWT_SECRET'],
      });

      // Gắn payload vào request để controller dùng qua @CurrentUser()
      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Access token is invalid or expired');
    }
  }

  /** Trích xuất Bearer token từ Authorization header */
  private _extractToken(request: Request): string | null {
    const authHeader = request.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    return authHeader.slice(7);
  }
}
