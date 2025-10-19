import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { PrismaService } from '@/database/prisma.service';

@Module({
  controllers: [TransactionController],
  providers: [TransactionService, PrismaService],
  exports: [TransactionService],
})
export class TransactionModule {}
