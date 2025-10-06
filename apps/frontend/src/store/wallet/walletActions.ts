import { StateCreator } from 'zustand';
import { Wallet } from '@q3x/models';
import { WalletState } from './walletState';

export interface WalletActions {
  setCurrentWallet: (wallet: Wallet | null) => void;
  clearCurrentWallet: () => void;
}

export const createWalletActions: StateCreator<
  WalletState & WalletActions,
  [],
  [],
  WalletActions
> = (set, get, store) => ({
  setCurrentWallet: (wallet: Wallet | null) => {
    set({ 
      currentWallet: wallet
    });
  },

  clearCurrentWallet: () => {
    set({ 
      currentWallet: null,
    });
  },
});
