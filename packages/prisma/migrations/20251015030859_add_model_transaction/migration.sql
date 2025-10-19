-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('DRAFT', 'PROPOSED', 'EXECUTED', 'FAILED');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('ICP_TRANSFER', 'EVM_TRANSFER');

-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL,
    "wallet_id" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'DRAFT',
    "data" JSONB NOT NULL,
    "description" TEXT,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "executed_at" TIMESTAMP(3),

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_wallet_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "deployed_wallets"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
