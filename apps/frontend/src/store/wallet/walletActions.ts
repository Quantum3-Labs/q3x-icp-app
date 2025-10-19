import { StateCreator } from "zustand";
import { Wallet, WalletChain } from "@q3x/models";
import { WalletState } from "./walletState";
import { getAccountAddressFromPrincipal } from "@/utils/helper";

export interface WalletActions {
  setCurrentWallet: (wallet: Wallet | null) => void;
  clearCurrentWallet: () => void;
  setActiveChain: (chainId: string, address: string) => void;
  setSubaccounts: (subaccounts: WalletChain[]) => void;
  switchToNetwork: (chainId: string) => void;
  getCurrentNetwork: () => { chainId: string; address: string; name: string } | null;
  isICPActive: () => boolean;
}

export const createWalletActions: StateCreator<WalletState & WalletActions, [], [], WalletActions> = (
  set,
  get,
  store,
) => ({
  setCurrentWallet: (wallet: Wallet | null) => {
    set({
      currentWallet: wallet,
    });
  },

  clearCurrentWallet: () => {
    set({
      currentWallet: null,
    });
  },

  setActiveChain: (chainId: string, address: string) => {
    set({
      activeChainId: chainId,
      activeAddress: address,
    });
  },

  setSubaccounts: (subaccounts: WalletChain[]) => {
    set({ subaccounts });
  },

  switchToNetwork: (chainId: string) => {
    const state = get();

    if (chainId === "0") {
      // Switch to ICP
      const icpAddress = state.currentWallet ? getAccountAddressFromPrincipal(state.currentWallet.canisterId) : "";

      set({
        activeChainId: "0",
        activeAddress: icpAddress,
      });
    } else {
      // Switch to EVM chain
      const subaccount = state.subaccounts.find(sub => sub.chainId === chainId);

      if (subaccount) {
        set({
          activeChainId: chainId,
          activeAddress: subaccount.evmAddress,
        });
      }
    }
  },

  getCurrentNetwork: () => {
    const state = get();

    if (state.activeChainId === "0") {
      return {
        chainId: "0",
        address: state.activeAddress,
        name: "ICP",
      };
    }

    const subaccount = state.subaccounts.find(sub => sub.chainId === state.activeChainId);
    if (subaccount) {
      return {
        chainId: subaccount.chainId,
        address: subaccount.evmAddress,
        name: subaccount.displayName,
      };
    }

    return null;
  },

  isICPActive: () => {
    const state = get();
    return state.activeChainId === "0";
  }
});
