import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { prisma, PrismaClient } from '@masik/database';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  get client(): PrismaClient {
    return prisma;
  }

  async onModuleInit() {
    try {
      await prisma.$connect();
      console.log('✅ PostgreSQL connection established');
    } catch (err) {
      console.warn('⚠️ PostgreSQL not reachable yet. API initialized in resilient standby mode.');
    }
  }

  async onModuleDestroy() {
    await prisma.$disconnect();
  }
}
