import { Controller, Get, Query, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { INSIGHT_SERVICE, MESSAGE_PATTERNS } from '@app/shared/constants/index';
import { CurrentUser } from '../decorators/current-user.decorator';
import { IJwtPayload } from '@app/shared/interfaces';

@Controller('insights')
export class InsightGatewayController {
  constructor(
    @Inject(INSIGHT_SERVICE) private readonly insightClient: ClientProxy,
  ) {}

  /** Thống kê chi tiêu theo tháng */
  @Get('stats')
  async getStats(
    @CurrentUser() user: IJwtPayload,
    @Query('month') month?: string,
  ) {
    return firstValueFrom(
      this.insightClient.send(MESSAGE_PATTERNS.INSIGHT_STATS, {
        userId: user.sub,
        month: month || new Date().toISOString().slice(0, 7),
      }),
    );
  }

  /** Phân tích hành vi chi tiêu */
  @Get('behavior')
  async getBehavior(@CurrentUser() user: IJwtPayload) {
    return firstValueFrom(
      this.insightClient.send(MESSAGE_PATTERNS.INSIGHT_BEHAVIOR, {
        userId: user.sub,
      }),
    );
  }

  /** Gợi ý tiết kiệm từ AI */
  @Get('recommendations')
  async getRecommendations(@CurrentUser() user: IJwtPayload) {
    return firstValueFrom(
      this.insightClient.send(MESSAGE_PATTERNS.INSIGHT_RECOMMEND, {
        userId: user.sub,
      }),
    );
  }
}
