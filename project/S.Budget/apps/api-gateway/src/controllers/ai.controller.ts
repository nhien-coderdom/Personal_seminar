import { Controller, Post, Body, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AI_SERVICE, MESSAGE_PATTERNS } from '@app/shared/constants/index';
import { CurrentUser } from '../decorators/current-user.decorator';
import { IJwtPayload } from '@app/shared/interfaces';

@Controller('ai')
export class AiGatewayController {
  constructor(
    @Inject(AI_SERVICE) private readonly aiClient: ClientProxy,
  ) {}

  @Post('chat')
  async chatWithAssistant(
    @CurrentUser() user: IJwtPayload,
    @Body() body: { messages: any[] },
  ) {
    if (!body || !body.messages || !Array.isArray(body.messages)) {
      return {
        statusCode: 400,
        message: 'Messages array is required',
      };
    }

    // Call AI Service
    return firstValueFrom(
      this.aiClient.send(MESSAGE_PATTERNS.AI_CHAT, {
        messages: body.messages,
      }),
    );
  }
}
