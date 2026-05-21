import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  AUTH_SERVICE,
  AUTH_QUEUE,
  TRANSACTION_SERVICE,
  TRANSACTION_QUEUE,
  AI_SERVICE,
  AI_QUEUE,
  INSIGHT_SERVICE,
  INSIGHT_QUEUE,
} from '@app/shared/constants/index';
import { AuthGatewayController } from './controllers/auth.controller';
import { TransactionGatewayController } from './controllers/transaction.controller';
import { InsightGatewayController } from './controllers/insight.controller';
import { AiGatewayController } from './controllers/ai.controller';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CloudinaryService } from './services/cloudinary.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    // JwtModule dùng để verify token trong JwtAuthGuard
    JwtModule.register({}),

    // Rate Limiting: 100 requests / 60 seconds
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),

    ClientsModule.register([
      {
        name: AUTH_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: [process.env['RABBITMQ_URL'] || 'amqp://localhost:5672'],
          queue: AUTH_QUEUE,
          queueOptions: { durable: true },
        },
      },
      {
        name: TRANSACTION_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: [process.env['RABBITMQ_URL'] || 'amqp://localhost:5672'],
          queue: TRANSACTION_QUEUE,
          queueOptions: { durable: true },
        },
      },
      {
        name: AI_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: [process.env['RABBITMQ_URL'] || 'amqp://localhost:5672'],
          queue: AI_QUEUE,
          queueOptions: { durable: true },
        },
      },
      {
        name: INSIGHT_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: [process.env['RABBITMQ_URL'] || 'amqp://localhost:5672'],
          queue: INSIGHT_QUEUE,
          queueOptions: { durable: true },
        },
      },
    ]),
  ],
  controllers: [
    AuthGatewayController,
    TransactionGatewayController,
    InsightGatewayController,
    AiGatewayController,
  ],
  providers: [
    CloudinaryService,
    // Đăng ký JwtAuthGuard làm GLOBAL GUARD — áp dụng cho tất cả routes
    // Routes có @Public() sẽ được bypass tự động
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class ApiGatewayModule {}
