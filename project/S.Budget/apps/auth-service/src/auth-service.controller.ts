import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthServiceService } from './auth-service.service';
import { MESSAGE_PATTERNS } from '@app/shared/constants';
import { RegisterDto, LoginDto } from '@app/shared/dto';

@Controller()
export class AuthServiceController {
  constructor(private readonly authServiceService: AuthServiceService) {}

  /** POST /auth/register */
  @MessagePattern(MESSAGE_PATTERNS.AUTH_REGISTER)
  register(@Payload() dto: RegisterDto) {
    return this.authServiceService.register(dto);
  }

  /** POST /auth/login */
  @MessagePattern(MESSAGE_PATTERNS.AUTH_LOGIN)
  login(@Payload() dto: LoginDto) {
    return this.authServiceService.login(dto);
  }

  /** Dùng bởi API Gateway để xác thực JWT */
  @MessagePattern(MESSAGE_PATTERNS.AUTH_VALIDATE)
  validateToken(@Payload() data: { token: string }) {
    return this.authServiceService.validateToken(data.token);
  }

  /** Lấy Access Token mới từ Refresh Token */
  @MessagePattern(MESSAGE_PATTERNS.AUTH_REFRESH)
  refreshToken(@Payload() data: { refreshToken: string }) {
    return this.authServiceService.refreshToken(data.refreshToken);
  }
}
