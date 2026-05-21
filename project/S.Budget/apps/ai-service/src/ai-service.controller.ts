import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { AiServiceService } from './ai-service.service';
import { MESSAGE_PATTERNS } from '@app/shared/constants';

@Controller()
export class AiServiceController {
  constructor(private readonly aiServiceService: AiServiceService) {}

  @MessagePattern(MESSAGE_PATTERNS.AI_PARSE_TEXT)
  async parseText(@Payload() data: { text: string }) {
    if (!data?.text) {
      throw new RpcException({ statusCode: 400, message: 'Text is required' });
    }
    return this.aiServiceService.parseTextToTransaction(data.text);
  }

  @MessagePattern(MESSAGE_PATTERNS.AI_OCR_PROCESS)
  async processImageOcr(@Payload() data: { imageUrl: string }) {
    if (!data?.imageUrl) {
      throw new RpcException({
        statusCode: 400,
        message: 'Image URL is required',
      });
    }
    return this.aiServiceService.processImageOcr(data.imageUrl);
  }

  @MessagePattern(MESSAGE_PATTERNS.AI_CHAT)
  async chatWithAssistant(@Payload() data: { messages: any[] }) {
    if (!data?.messages || !Array.isArray(data.messages)) {
      throw new RpcException({
        statusCode: 400,
        message: 'Messages array is required',
      });
    }
    return this.aiServiceService.chatWithAssistant(data.messages);
  }
}
