import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { createWalletActions, WalletActions } from './walletActions';
import { initialWalletState, WalletState } from './walletState';

type WalletStore = WalletState & WalletActions;

export const useWalletStore = create<WalletStore>()(
  devtools(
    persist(
      (set, get, store) => ({
        ...initialWalletState,
        ...createWalletActions(set, get, store),
      }),
      {
        name: 'wallet-store',
        partialize: (state) => ({
          currentWallet: state.currentWallet, // Persist current wallet
        }),
      }
    ),
    { name: 'WalletStore' }
  )
);
