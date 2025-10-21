import { WalletChain as PrismaWalletChain } from "@q3x/prisma";

export class WalletChain {
  canisterId: string;
  chainId: string;
  chainName: string;
  displayName: string;
  evmAddress: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(prismaWalletChain: Partial<PrismaWalletChain>) {
    this.canisterId = prismaWalletChain.canisterId || '';
    this.chainId = prismaWalletChain.chainId || '';
    this.chainName = prismaWalletChain.chainName || '';
    this.displayName = prismaWalletChain.displayName || '';
    this.evmAddress = prismaWalletChain.evmAddress || '';
    this.createdAt = prismaWalletChain.createdAt || new Date();
    this.updatedAt = prismaWalletChain.updatedAt || new Date();
  }
}
