-- CreateTable
CREATE TABLE "wallet_chain" (
    "wallet_id" TEXT NOT NULL,
    "chain_id" TEXT NOT NULL,
    "chain_name" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "evm_address" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wallet_chain_pkey" PRIMARY KEY ("wallet_id","chain_id")
);

-- AddForeignKey
ALTER TABLE "wallet_chain" ADD CONSTRAINT "wallet_chain_wallet_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "deployed_wallets"("name") ON DELETE CASCADE ON UPDATE CASCADE;
