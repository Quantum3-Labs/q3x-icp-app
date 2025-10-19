import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import {
  BatchUpdateStatusDto,
  CreateTransactionDto,
  Transaction,
} from '@q3x/models';
import { TransactionStatus, TransactionType } from '@q3x/prisma';

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);

  constructor(private prismaService: PrismaService) {}

  async createTransaction(
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    const { walletId, type, description, createdBy, data } =
      createTransactionDto;

    try {
      // Verify wallet exists
      const wallet = await this.prismaService.deployedWallet.findUnique({
        where: { name: walletId },
      });

      if (!wallet) {
        throw new NotFoundException(`Wallet with ID ${walletId} not found`);
      }

      const transaction = await this.prismaService.transaction.create({
        data: {
          walletId,
          type,
          data,
          description,
          createdBy,
          status: TransactionStatus.DRAFT,
        },
      });

      this.logger.log(`Transaction created successfully: ${transaction.id}`);
      return new Transaction(transaction);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error('Failed to create transaction', error);
      throw new BadRequestException(
        `Failed to create transaction: ${error.message}`,
      );
    }
  }

  async getTransactions(filters: {
    walletId?: string;
    status?: string;
    type?: string;
  }): Promise<Transaction[]> {
    try {
      const { walletId, status, type } = filters;

      // Build where clause
      const where: any = {};
      if (walletId) {
        where.walletId = walletId;
      }
      if (status) {
        where.status = status as TransactionStatus;
      }
      if (type) {
        where.type = type as TransactionType;
      }

      const transactions = await this.prismaService.transaction.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });

      return transactions.map((transaction) => new Transaction(transaction));
    } catch (error) {
      this.logger.error('Failed to get transactions', error);
      throw new BadRequestException(
        `Failed to get transactions: ${error.message}`,
      );
    }
  }

  async getTransaction(id: string): Promise<Transaction> {
    try {
      const transaction = await this.prismaService.transaction.findUnique({
        where: { id },
      });

      if (!transaction) {
        throw new NotFoundException(`Transaction with ID ${id} not found`);
      }

      return new Transaction(transaction);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to get transaction ${id}`, error);
      throw new BadRequestException(
        `Failed to get transaction: ${error.message}`,
      );
    }
  }

  async updateTransactionStatus(
    id: string,
    status: TransactionStatus,
  ): Promise<Transaction> {
    try {
      const updateData: any = {
        status,
        updatedAt: new Date(),
      };

      if (status === TransactionStatus.EXECUTED) {
        updateData.executedAt = new Date();
      }

      const transaction = await this.prismaService.transaction.update({
        where: { id },
        data: updateData,
      });

      this.logger.log(`Transaction status updated: ${id} -> ${status}`);
      return new Transaction(transaction);
    } catch (error) {
      this.logger.error(`Failed to update transaction status ${id}`, error);
      throw new BadRequestException(
        `Failed to update transaction status: ${error.message}`,
      );
    }
  }

  async updateMultipleTransactionStatus(
    updateDto: BatchUpdateStatusDto,
  ): Promise<Transaction[]> {
    const { transactionIds, status, walletId } = updateDto;

    try {
      // Verify all transactions belong to the wallet
      const transactions = await this.prismaService.transaction.findMany({
        where: {
          id: { in: transactionIds },
          walletId,
        },
      });

      if (transactions.length !== transactionIds.length) {
        throw new BadRequestException(
          'Some transactions are not found or do not belong to the specified wallet',
        );
      }

      const updateData: any = {
        status: status as TransactionStatus,
        updatedAt: new Date(),
      };

      if (status === 'EXECUTED') {
        updateData.executedAt = new Date();
      }

      // Bulk update
      await this.prismaService.transaction.updateMany({
        where: {
          id: { in: transactionIds },
        },
        data: updateData,
      });

      // Get updated transactions
      const updatedTransactions = await this.prismaService.transaction.findMany(
        {
          where: {
            id: { in: transactionIds },
          },
          orderBy: { createdAt: 'asc' },
        },
      );

      this.logger.log(
        `Updated ${transactionIds.length} transactions to ${status}`,
      );
      return updatedTransactions.map((tx) => new Transaction(tx));
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error('Failed to update multiple transaction status', error);
      throw new BadRequestException(
        `Failed to update transaction status: ${error.message}`,
      );
    }
  }

  async deleteMultipleTransactions(transactionIds: string[]): Promise<number> {
    try {
      if (!transactionIds || transactionIds.length === 0) {
        throw new BadRequestException('Transaction IDs array cannot be empty');
      }

      // Validate that all transactions exist
      const existingTransactions =
        await this.prismaService.transaction.findMany({
          where: {
            id: {
              in: transactionIds,
            },
          },
          select: { id: true },
        });

      const existingIds = existingTransactions.map((t) => t.id);
      const notFoundIds = transactionIds.filter(
        (id) => !existingIds.includes(id),
      );

      if (notFoundIds.length > 0) {
        throw new NotFoundException(
          `Transactions not found: ${notFoundIds.join(', ')}`,
        );
      }

      // Delete transactions
      const deleteResult = await this.prismaService.transaction.deleteMany({
        where: {
          id: {
            in: transactionIds,
          },
        },
      });

      this.logger.log(`Deleted ${deleteResult.count} transactions`);
      return deleteResult.count;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      this.logger.error('Failed to delete multiple transactions', error);
      throw new BadRequestException(
        `Failed to delete transactions: ${error.message}`,
      );
    }
  }
}
