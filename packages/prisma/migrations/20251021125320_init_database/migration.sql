-- CreateEnum
CREATE TYPE "DeploymentStatus" AS ENUM ('DEPLOYING', 'DEPLOYED', 'FAILED', 'STOPPED');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('DRAFT', 'PROPOSED', 'EXECUTED', 'FAILED');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('ICP_TRANSFER', 'EVM_TRANSFER');

-- CreateTable
CREATE TABLE "deployed_wallets" (
    "id" TEXT NOT NULL,
    "canister_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "DeploymentStatus" NOT NULL DEFAULT 'DEPLOYING',
    "metadata" JSONB,
    "wasm_hash" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "deployed_wallets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wallet_chain" (
    "canister_id" TEXT NOT NULL,
    "chain_id" TEXT NOT NULL,
    "chain_name" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "evm_address" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wallet_chain_pkey" PRIMARY KEY ("canister_id","chain_id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "principal" TEXT NOT NULL,
    "address" TEXT,
    "display_name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wallet_signers" (
    "id" TEXT NOT NULL,
    "canister_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "wallet_signers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL,
    "canister_id" TEXT NOT NULL,
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

-- CreateIndex
CREATE UNIQUE INDEX "deployed_wallets_canister_id_key" ON "deployed_wallets"("canister_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_principal_key" ON "users"("principal");

-- CreateIndex
CREATE UNIQUE INDEX "wallet_signers_canister_id_user_id_key" ON "wallet_signers"("canister_id", "user_id");

-- AddForeignKey
ALTER TABLE "wallet_chain" ADD CONSTRAINT "wallet_chain_canister_id_fkey" FOREIGN KEY ("canister_id") REFERENCES "deployed_wallets"("canister_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallet_signers" ADD CONSTRAINT "wallet_signers_canister_id_fkey" FOREIGN KEY ("canister_id") REFERENCES "deployed_wallets"("canister_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallet_signers" ADD CONSTRAINT "wallet_signers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_canister_id_fkey" FOREIGN KEY ("canister_id") REFERENCES "deployed_wallets"("canister_id") ON DELETE RESTRICT ON UPDATE CASCADE;
