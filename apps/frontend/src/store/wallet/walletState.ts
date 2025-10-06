import { Wallet } from '@q3x/models';

export interface WalletState {
  currentWallet: Wallet | null;
}

export const initialWalletState: WalletState = {
  currentWallet: null,
};
