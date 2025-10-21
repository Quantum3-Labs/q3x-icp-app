import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CreateTransactionDto,
  CreateTransactionResponseDto,
  TransactionsResponseDto,
  TransactionResponseDto,
  UpdateTransactionResponseDto,
  BatchUpdateStatusDto,
  Transaction,
  UpdateTransactionsResponseDto,
} from "@q3x/models";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// API functions
const createTransactionAPI = async (transactionData: CreateTransactionDto): Promise<Transaction> => {
  const response = await fetch(`${API_BASE_URL}/api/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(transactionData),
  });

  if (!response.ok) {
    throw new Error(`Backend Error: ${response.statusText}`);
  }

  const result: CreateTransactionResponseDto = await response.json();

  if (!result.success) {
    throw new Error(result.message || "API returned error");
  }

  return result.data;
};

const getTransactions = async (filters: {
  canisterId?: string;
  status?: string;
  type?: string;
}): Promise<Transaction[]> => {
  const params = new URLSearchParams();
  if (filters.canisterId) params.append("canisterId", filters.canisterId);
  if (filters.status) params.append("status", filters.status);
  if (filters.type) params.append("type", filters.type);

  const response = await fetch(`${API_BASE_URL}/api/transactions?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch transactions: ${response.statusText}`);
  }

  const result: TransactionsResponseDto = await response.json();

  if (!result.success) {
    throw new Error("API returned error");
  }

  return result.data;
};

const getTransactionById = async (id: string): Promise<Transaction> => {
  if (!id) {
    throw new Error("Transaction ID is required");
  }

  const response = await fetch(`${API_BASE_URL}/api/transactions/${id}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch transaction: ${response.statusText}`);
  }

  const result: TransactionResponseDto = await response.json();

  if (!result.success) {
    throw new Error("API returned error");
  }

  return result.data;
};

const updateTransactionStatusAPI = async ({ id, status }: { id: string; status: string }): Promise<Transaction> => {
  const response = await fetch(`${API_BASE_URL}/api/transactions/${id}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    throw new Error(`Backend Error: ${response.statusText}`);
  }

  const result: UpdateTransactionResponseDto = await response.json();

  if (!result.success) {
    throw new Error(result.message || "API returned error");
  }

  return result.data;
};

const bulkUpdateTransactionStatusAPI = async (updateData: BatchUpdateStatusDto): Promise<Transaction[]> => {
  const response = await fetch(`${API_BASE_URL}/api/transactions/bulk-status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updateData),
  });

  if (!response.ok) {
    throw new Error(`Backend Error: ${response.statusText}`);
  }

  const result: UpdateTransactionsResponseDto = await response.json();

  if (!result.success) {
    throw new Error(result.message || "API returned error");
  }

  return result.data;
};

const batchDeleteTransactionsAPI = async (transactionIds: string[]): Promise<number> => {
  const response = await fetch(`${API_BASE_URL}/api/transactions/batch`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ transactionIds }),
  });

  if (!response.ok) {
    throw new Error(`Backend Error: ${response.statusText}`);
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.message || "API returned error");
  }

  return result.count;
};

// Query keys
export const transactionKeys = {
  all: ["transactions"] as const,
  byWallet: (canisterId: string) => [...transactionKeys.all, "wallet", canisterId] as const,
  byWalletAndStatus: (canisterId: string, status: string) =>
    [...transactionKeys.all, "wallet", canisterId, "status", status] as const,
  byWalletAndType: (canisterId: string, type: string) =>
    [...transactionKeys.all, "wallet", canisterId, "type", type] as const,
  byId: (id: string) => [...transactionKeys.all, "id", id] as const,
  filtered: (filters: { canisterId?: string; status?: string; type?: string }) =>
    [...transactionKeys.all, "filtered", filters] as const,
};

// React Query hooks
export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTransactionAPI,
    onSuccess: data => {
      // Invalidate transactions for this wallet
      queryClient.invalidateQueries({
        queryKey: transactionKeys.byWallet(data.canisterId),
      });
      // Invalidate all transaction queries
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
    },
    onError: error => {
      console.error("Create transaction error:", error);
    },
  });
};

export const useTransactions = (filters: { canisterId?: string; status?: string; type?: string }) => {
  return useQuery({
    queryKey: transactionKeys.filtered(filters),
    queryFn: () => getTransactions(filters),
    enabled: !!filters.canisterId, // Only fetch if canisterId is provided
  });
};

export const useTransactionById = (id: string) => {
  return useQuery({
    queryKey: transactionKeys.byId(id),
    queryFn: () => getTransactionById(id),
    enabled: !!id,
  });
};

export const useUpdateTransactionStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTransactionStatusAPI,
    onSuccess: data => {
      // Invalidate specific transaction
      queryClient.invalidateQueries({
        queryKey: transactionKeys.byId(data.id),
      });
      // Invalidate transactions for this wallet
      queryClient.invalidateQueries({
        queryKey: transactionKeys.byWallet(data.canisterId),
      });
      // Invalidate all transaction queries
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
    },
    onError: error => {
      console.error("Update transaction status error:", error);
    },
  });
};

export const useBulkUpdateTransactionStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkUpdateTransactionStatusAPI,
    onSuccess: (transactions, variables) => {
      // Invalidate transactions for this wallet
      queryClient.invalidateQueries({
        queryKey: transactionKeys.byWallet(variables.canisterId),
      });
      // Invalidate all transaction queries
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });

      // Optionally update individual transaction caches
      transactions.forEach(tx => {
        queryClient.setQueryData(transactionKeys.byId(tx.id), tx);
      });
    },
    onError: error => {
      console.error("Bulk update transaction status error:", error);
    },
  });
};

export const useBatchDeleteTransactions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (transactionIds: string[]) => batchDeleteTransactionsAPI(transactionIds),
    onSuccess: deletedCount => {
      // Invalidate all transaction queries since we don't know which wallets were affected
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });

      console.log(`Successfully deleted ${deletedCount} transactions`);
    },
    onError: error => {
      console.error("Batch delete transactions error:", error);
    },
  });
};

// Convenience hooks for specific use cases
export const useDraftTransactions = (canisterId: string) => {
  return useTransactions({ canisterId, status: "DRAFT" });
};

export const useProposedTransactions = (canisterId: string) => {
  return useTransactions({ canisterId, status: "PROPOSED" });
};

export const useExecutedTransactions = (canisterId: string) => {
  return useTransactions({ canisterId, status: "EXECUTED" });
};
