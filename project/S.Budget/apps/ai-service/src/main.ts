import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AiServiceModule } from './ai-service.module';
import { AI_QUEUE } from '@app/shared/constants/index';
import { AllRpcExceptionsFilter } from '@app/shared/filters/all-rpc-exceptions.filter';
async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AiServiceModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env['RABBITMQ_URL'] || 'amqp://localhost:5672'],
        queue: AI_QUEUE,
        queueOptions: { durable: true },
      },
    },
  );

  // Apply global exception filter
  app.useGlobalFilters(new AllRpcExceptionsFilter());

  await app.listen();
  console.log('🤖 AI Service is listening on RabbitMQ');
}
bootstrap();
