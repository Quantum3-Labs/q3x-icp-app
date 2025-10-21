import { WalletSigner as PrismaWalletSigner } from '@q3x/prisma';

export class WalletSigner {
  id?: string;
  canisterId?: string;
  userId?: string;

  constructor(prismaWalletSigner: Partial<PrismaWalletSigner>) {
    this.id = prismaWalletSigner.id;
    this.canisterId = prismaWalletSigner.canisterId;
    this.userId = prismaWalletSigner.userId;
  }
}
