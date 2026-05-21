import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { InsightServiceModule } from './insight-service.module';
import { INSIGHT_QUEUE } from '@app/shared/constants/index';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    InsightServiceModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env['RABBITMQ_URL'] || 'amqp://localhost:5672'],
        queue: INSIGHT_QUEUE,
        queueOptions: { durable: true },
      },
    },
  );

  await app.listen();
  console.log('📊 Insight Service is listening on RabbitMQ');
}
bootstrap();
