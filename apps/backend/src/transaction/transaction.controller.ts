import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  Logger,
  Delete,
} from '@nestjs/common';
import {
  CreateTransactionDto,
  UpdateTransactionStatusDto,
  CreateTransactionResponseDto,
  TransactionsResponseDto,
  TransactionResponseDto,
  BatchUpdateStatusDto,
  UpdateTransactionsResponseDto,
  UpdateTransactionResponseDto,
  BatchDeleteDto,
  BatchDeleteResponseDto,
} from '@q3x/models';
import { TransactionService } from './transaction.service';

@Controller('transactions')
export class TransactionController {
  private readonly logger = new Logger(TransactionController.name);

  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createTransaction(
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<CreateTransactionResponseDto> {
    this.logger.log(
      `Creating transaction for wallet: ${createTransactionDto.canisterId}`,
    );
    const transaction =
      await this.transactionService.createTransaction(createTransactionDto);

    return {
      success: true,
      data: transaction,
      message: 'Transaction created successfully',
    };
  }

  @Get()
  async getTransactions(
    @Query('canisterId') canisterId?: string,
    @Query('status') status?: string,
    @Query('type') type?: string,
  ): Promise<TransactionsResponseDto> {
    this.logger.log(
      `Getting transactions - canisterId: ${canisterId}, status: ${status}, type: ${type}`,
    );
    const transactions = await this.transactionService.getTransactions({
      canisterId,
      status,
      type,
    });

    return {
      success: true,
      data: transactions,
      count: transactions.length,
    };
  }

  @Get(':id')
  async getTransaction(
    @Param('id') id: string,
  ): Promise<TransactionResponseDto> {
    this.logger.log(`Getting transaction: ${id}`);
    const transaction = await this.transactionService.getTransaction(id);

    return {
      success: true,
      data: transaction,
    };
  }

  @Put(':id/status')
  async updateTransactionStatus(
    @Param('id') id: string,
    @Body() updateDto: UpdateTransactionStatusDto,
  ): Promise<UpdateTransactionResponseDto> {
    this.logger.log(
      `Updating transaction status: ${id} -> ${updateDto.status}`,
    );
    const transaction = await this.transactionService.updateTransactionStatus(
      id,
      updateDto.status as any,
    );

    return {
      success: true,
      data: transaction,
      message: 'Transaction status updated successfully',
    };
  }
  @Put('bulk-status')
  async updateMultipleTransactionStatus(
    @Body() updateDto: BatchUpdateStatusDto,
  ): Promise<UpdateTransactionsResponseDto> {
    this.logger.log(
      `Updating ${updateDto.transactionIds.length} transactions to ${updateDto.status}`,
    );
    const transactions =
      await this.transactionService.updateMultipleTransactionStatus(updateDto);

    return {
      success: true,
      data: transactions,
      message: `${updateDto.transactionIds.length} transactions updated successfully`,
    };
  }

  @Delete('batch')
  @HttpCode(HttpStatus.OK)
  async deleteMultipleTransactions(
    @Body() deleteDto: BatchDeleteDto,
  ): Promise<BatchDeleteResponseDto> {
    this.logger.log(`Deleting ${deleteDto.transactionIds.length} transactions`);
    const deletedCount =
      await this.transactionService.deleteMultipleTransactions(
        deleteDto.transactionIds,
      );

    return {
      success: true,
      message: `${deletedCount} transactions deleted successfully`,
      count: deletedCount,
    };
  }
}
