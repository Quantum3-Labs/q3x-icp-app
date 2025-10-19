import { Wallet, WalletChain } from "@q3x/models";

export interface WalletState {
  currentWallet: Wallet | null;
  activeChainId: string;
  activeAddress: string;
  subaccounts: WalletChain[];
}

export const initialWalletState: WalletState = {
  currentWallet: null,
  activeChainId: "0",
  activeAddress: "",
  subaccounts: [],
};
