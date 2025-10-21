/*
  Warnings:

  - You are about to drop the column `wallet_id` on the `transactions` table. All the data in the column will be lost.
  - The primary key for the `wallet_chain` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `wallet_id` on the `wallet_chain` table. All the data in the column will be lost.
  - You are about to drop the column `wallet_id` on the `wallet_signers` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[canister_id,user_id]` on the table `wallet_signers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `canister_id` to the `transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `canister_id` to the `wallet_chain` table without a default value. This is not possible if the table is not empty.
  - Added the required column `canister_id` to the `wallet_signers` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."transactions" DROP CONSTRAINT "transactions_wallet_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."wallet_chain" DROP CONSTRAINT "wallet_chain_wallet_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."wallet_signers" DROP CONSTRAINT "wallet_signers_wallet_id_fkey";

-- DropIndex
DROP INDEX "public"."deployed_wallets_name_key";

-- DropIndex
DROP INDEX "public"."wallet_signers_wallet_id_user_id_key";

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "wallet_id",
ADD COLUMN     "canister_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "wallet_chain" DROP CONSTRAINT "wallet_chain_pkey",
DROP COLUMN "wallet_id",
ADD COLUMN     "canister_id" TEXT NOT NULL,
ADD CONSTRAINT "wallet_chain_pkey" PRIMARY KEY ("canister_id", "chain_id");

-- AlterTable
ALTER TABLE "wallet_signers" DROP COLUMN "wallet_id",
ADD COLUMN     "canister_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "wallet_signers_canister_id_user_id_key" ON "wallet_signers"("canister_id", "user_id");

-- AddForeignKey
ALTER TABLE "wallet_chain" ADD CONSTRAINT "wallet_chain_canister_id_fkey" FOREIGN KEY ("canister_id") REFERENCES "deployed_wallets"("canister_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallet_signers" ADD CONSTRAINT "wallet_signers_canister_id_fkey" FOREIGN KEY ("canister_id") REFERENCES "deployed_wallets"("canister_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_canister_id_fkey" FOREIGN KEY ("canister_id") REFERENCES "deployed_wallets"("canister_id") ON DELETE RESTRICT ON UPDATE CASCADE;
