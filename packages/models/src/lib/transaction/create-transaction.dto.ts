import {
  IsOptional,
  IsString,
  IsNotEmpty,
  IsEnum,
  IsObject,
  IsArray,
} from "class-validator";
import { TransactionType } from "@q3x/prisma";

export class CreateTransactionDto {
  @IsString()
  @IsNotEmpty()
  walletId: string;

  @IsEnum(TransactionType)
  type: TransactionType;

  @IsObject()
  data: Record<string, any>;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  @IsNotEmpty()
  createdBy: string;
}

export class UpdateTransactionStatusDto {
  @IsEnum(["DRAFT", "PROPOSED", "EXECUTED", "FAILED"])
  status: "DRAFT" | "PROPOSED" | "EXECUTED" | "FAILED";
}

export class BatchUpdateStatusDto {
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  transactionIds: string[];

  @IsEnum(["DRAFT", "PROPOSED", "EXECUTED", "FAILED"])
  status: "DRAFT" | "PROPOSED" | "EXECUTED" | "FAILED";

  @IsString()
  @IsNotEmpty()
  walletId: string;
}

export class BatchDeleteDto {
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  transactionIds: string[];
}

export class BatchDeleteResponseDto {
  success: boolean;
  message: string;
  count: number;
}
