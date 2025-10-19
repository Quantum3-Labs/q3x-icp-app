import { ApiResponse, ListResponse } from '../api/api-response.dto';
import { Transaction } from './transaction.model';

export interface CreateTransactionResponseDto extends ApiResponse<Transaction> {
  success: true;
  data: Transaction;
  message: string;
}

export interface TransactionResponseDto extends ApiResponse<Transaction> {
  success: true;
  data: Transaction;
}

export interface TransactionsResponseDto extends ListResponse<Transaction> {
  success: true;
  data: Transaction[];
  count: number;
}

export interface UpdateTransactionResponseDto extends ApiResponse<Transaction> {
  success: true;
  data: Transaction;
  message: string;
}

export interface UpdateTransactionsResponseDto extends ApiResponse<Transaction[]> {
  success: true;
  data: Transaction[];
  message: string;
}

export interface BatchProposeResponseDto extends ApiResponse<{ batchId: string; transactions: Transaction[] }> {
  success: true;
  data: {
    batchId: string;
    transactions: Transaction[];
  };
  message: string;
}
