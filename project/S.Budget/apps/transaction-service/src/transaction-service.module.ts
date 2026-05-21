import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TransactionServiceController } from './transaction-service.controller';
import { TransactionServiceService } from './transaction-service.service';
import { PrismaService } from './prisma.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [TransactionServiceController],
  providers: [TransactionServiceService, PrismaService],
})
export class TransactionServiceModule {}
