import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { TransactionServiceModule } from './transaction-service.module';
import { TransactionServiceService } from './transaction-service.service';
import { TRANSACTION_QUEUE } from '@app/shared/constants/index';
import { AllRpcExceptionsFilter } from '@app/shared/filters/all-rpc-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    TransactionServiceModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env['RABBITMQ_URL'] || 'amqp://localhost:5672'],
        queue: TRANSACTION_QUEUE,
        queueOptions: { durable: true },
      },
    },
  );

  // Chuyển mọi HttpException → RpcException { statusCode, message }
  app.useGlobalFilters(new AllRpcExceptionsFilter());

  await app.listen();
  console.log('💰 Transaction Service is listening on RabbitMQ');

  // Seed default categories sau khi service đã sẵn sàng (kết nối DB xong)
  try {
    const transactionService = app.get(TransactionServiceService);
    await transactionService.seedDefaultCategories();
    console.log('✅ Default categories seeded');
  } catch (err) {
    // Không crash nếu seed thất bại (DB chưa migrate)
    console.warn('⚠️  Could not seed categories:', (err as Error).message);
  }
}
bootstrap();
