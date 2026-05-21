import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AiServiceController } from './ai-service.controller';
import { AiServiceService } from './ai-service.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [AiServiceController],
  providers: [AiServiceService],
})
export class AiServiceModule {}
