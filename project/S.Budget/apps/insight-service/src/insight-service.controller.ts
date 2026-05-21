import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { InsightServiceService } from './insight-service.service';
import { MESSAGE_PATTERNS } from '@app/shared/constants/index';

@Controller()
export class InsightServiceController {
  constructor(private readonly insightService: InsightServiceService) {}

  @MessagePattern(MESSAGE_PATTERNS.INSIGHT_STATS)
  async getStats(@Payload() data: { userId: string; month: string }) {
    return this.insightService.getStats(data);
  }

  @MessagePattern(MESSAGE_PATTERNS.INSIGHT_BEHAVIOR)
  async getBehavior(@Payload() data: { userId: string }) {
    return this.insightService.getBehavior(data);
  }

  @MessagePattern(MESSAGE_PATTERNS.INSIGHT_RECOMMEND)
  async getRecommendations(@Payload() data: { userId: string }) {
    return this.insightService.getRecommendations(data);
  }
}
