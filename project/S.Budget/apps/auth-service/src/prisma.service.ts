import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '.prisma/auth-client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    console.log('[PRISMA] Initializing Prisma client connection...');
    try {
      await this.$connect();
      console.log('[DB] Database connected successfully via Prisma');
    } catch (error) {
      console.error('[DB] Failed to connect to database', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    console.log('[PRISMA] Disconnecting Prisma client...');
    await this.$disconnect();
    console.log('[DB] Database disconnected');
  }
}
