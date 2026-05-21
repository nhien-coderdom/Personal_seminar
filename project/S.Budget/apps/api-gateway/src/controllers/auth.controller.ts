import { Controller, Post, Body, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AUTH_SERVICE, MESSAGE_PATTERNS } from '@app/shared/constants/index';
import { RegisterDto, LoginDto } from '@app/shared/dto/index';
import { Public } from '../decorators/public.decorator';

@Controller('auth')
export class AuthGatewayController {
  constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy) {}

  /** Đăng ký tài khoản — public route, không cần JWT */
  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return firstValueFrom(
      this.authClient.send(MESSAGE_PATTERNS.AUTH_REGISTER, registerDto),
    );
  }

  /** Đăng nhập — public route, không cần JWT */
  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return firstValueFrom(
      this.authClient.send(MESSAGE_PATTERNS.AUTH_LOGIN, loginDto),
    );
  }

  /** Làm mới Access Token — public route (dùng Refresh Token, không dùng Access Token) */
  @Public()
  @Post('refresh')
  async refresh(@Body('refreshToken') refreshToken: string) {
    return firstValueFrom(
      this.authClient.send(MESSAGE_PATTERNS.AUTH_REFRESH, { refreshToken }),
    );
  }
}
