import {
  TransactionStatus,
  TransactionType,
  Transaction as PrismaTransaction,
} from "@q3x/prisma";

export class Transaction {
  id: string;
  canisterId: string;
  type: TransactionType;
  status: TransactionStatus;
  data: Record<string, any>;
  description?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  executedAt?: Date;

  constructor(prismaTransaction: Partial<PrismaTransaction>) {
    this.id = prismaTransaction.id || "";
    this.canisterId = prismaTransaction.canisterId || "";
    this.type = prismaTransaction.type || TransactionType.ICP_TRANSFER;
    this.status = prismaTransaction.status || TransactionStatus.DRAFT;
    this.data = (prismaTransaction.data as Record<string, any>) || {};
    this.description = prismaTransaction.description || undefined;
    this.createdBy = prismaTransaction.createdBy || "";
    this.createdAt = prismaTransaction.createdAt || new Date();
    this.updatedAt = prismaTransaction.updatedAt || new Date();
    this.executedAt = prismaTransaction.executedAt || undefined;
  }
}
