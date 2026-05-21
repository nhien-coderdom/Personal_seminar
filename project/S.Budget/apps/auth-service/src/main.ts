import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AuthServiceModule } from './auth-service.module';
import { AUTH_QUEUE } from '@app/shared/constants/index';
import { AllRpcExceptionsFilter } from '@app/shared/filters/all-rpc-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthServiceModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env['RABBITMQ_URL'] || 'amqp://localhost:5672'],
        queue: AUTH_QUEUE,
        queueOptions: { durable: true },
      },
    },
  );

  // Chuyển mọi HttpException → RpcException { statusCode, message }
  app.useGlobalFilters(new AllRpcExceptionsFilter());

  await app.listen();
  console.log('🔐 Auth Service is listening on RabbitMQ');
}
bootstrap();
