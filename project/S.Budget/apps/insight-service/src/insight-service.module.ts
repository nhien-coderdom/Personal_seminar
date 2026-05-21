import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  TRANSACTION_SERVICE,
  TRANSACTION_QUEUE,
  AI_SERVICE,
  AI_QUEUE,
} from '@app/shared/constants/index';
import { InsightServiceController } from './insight-service.controller';
import { InsightServiceService } from './insight-service.service';
import { PrismaService } from './prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ClientsModule.registerAsync([
      {
        name: TRANSACTION_SERVICE,
        useFactory: () => ({
          transport: Transport.RMQ,
          options: {
            urls: [process.env['RABBITMQ_URL'] || 'amqp://localhost:5672'],
            queue: TRANSACTION_QUEUE,
            queueOptions: { durable: true },
          },
        }),
      },
      {
        name: AI_SERVICE,
        useFactory: () => ({
          transport: Transport.RMQ,
          options: {
            urls: [process.env['RABBITMQ_URL'] || 'amqp://localhost:5672'],
            queue: AI_QUEUE,
            queueOptions: { durable: true },
          },
        }),
      },
    ]),
  ],
  controllers: [InsightServiceController],
  providers: [InsightServiceService, PrismaService],
})
export class InsightServiceModule {}
