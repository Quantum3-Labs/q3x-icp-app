import { Actor, HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { StateCreator } from "zustand";
import { idlFactory } from "@/assets/wallet.did";
import { CanisterState } from "./canisterState";
import { useAuthStore } from "../auth";
import { getReplicaUrl } from "@/utils/helper";

export interface TransferEvmArgs {
  to: string;
  value: bigint;
  chain_id: bigint;
  gas_limit: bigint;
  wallet_id: string;
  gas_price: bigint;
}

export interface CanisterActions {
  // Actor management
  setActor: (canisterId: string) => Promise<any>;
  setCurrentCanister: (canisterId: string) => void;
  clearActor: () => void;

  // Wallet operations
  createWallet: (walletId: string, signers: string[], threshold: number) => Promise<any>;
  getWallet: (walletId: string) => Promise<any>;
  getWalletsForPrincipal: (principal: string) => Promise<string[]>;
  addSigner: (walletId: string, signerPrincipal: string) => Promise<string>;
  removeSigner: (walletId: string, signerPrincipal: string) => Promise<string>;
  setThreshold: (walletId: string, threshold: number) => Promise<string>;
  approveMessage: (walletId: string, messageId: string) => Promise<number>;
  checkCanSign: (walletId: string, messageId: string) => Promise<boolean>;
  signMessage: (walletId: string, messageId: string) => Promise<string>;
  transfer: (walletId: string, amount: bigint, recipient: string) => Promise<string>;
  getEvmAddress: (walletId: string) => Promise<string>;
  transferEvm: (args: TransferEvmArgs) => Promise<string>;
  getTransactionCount: (walletId: string, chainId: bigint) => Promise<bigint>;
  getWalletPortfolio: (walletId: string, chainId: bigint) => Promise<any>;
  proposeBatchTransaction: (walletId: string, batchData: any) => Promise<any>;
}

export const createCanisterActions: StateCreator<CanisterState & CanisterActions, [], [], CanisterActions> = (
  set,
  get,
  store,
) => ({
  setActor: async (canisterId: string) => {
    try {
      const { identity } = useAuthStore.getState();

      if (!identity) {
        throw new Error("No identity available");
      }

      const agent = await HttpAgent.create({
        host: getReplicaUrl(),
        identity,
      });

      if (process.env.NEXT_PUBLIC_NODE_ENV === "development") {
        await agent.fetchRootKey();
      }

      const walletActor = Actor.createActor(idlFactory, {
        agent,
        canisterId: Principal.fromText(canisterId),
      });

      set({
        actor: walletActor,
        currentCanisterId: canisterId,
      });

      console.log(`Wallet actor initialized with canister: ${canisterId}`);

      return walletActor;
    } catch (error) {
      console.error("Failed to initialize wallet actor:", error);
      throw error;
    }
  },

  setCurrentCanister: (canisterId: string) => {
    set({ currentCanisterId: canisterId });
  },

  clearActor: () => {
    set({ actor: null, currentCanisterId: null });
  },

  createWallet: async (walletId: string, signers: string[], threshold: number) => {
    const { actor } = get();
    if (!actor) throw new Error("Actor not initialized");

    try {
      const signerPrincipals = signers.map(signer => Principal.fromText(signer));
      const result = await actor.create_wallet(walletId, signerPrincipals, threshold);
      console.log("Create wallet result:", result);
      return result;
    } catch (error) {
      console.error("Failed to create wallet:", error);
      throw error;
    }
  },

  getWallet: async (walletId: string) => {
    const { actor } = get();
    if (!actor) throw new Error("Actor not initialized");

    try {
      const result = await actor.get_wallet(walletId);
      console.log("Get wallet result:", result);
      return result;
    } catch (error) {
      console.error("Failed to get wallet:", error);
      throw error;
    }
  },

  getWalletsForPrincipal: async (principal: string) => {
    const { actor } = get();
    if (!actor) throw new Error("Actor not initialized");

    try {
      const principalObj = Principal.fromText(principal);
      const result = await actor.get_wallets_for_principal(principalObj);
      console.log("Get wallets for principal result:", result);
      return result;
    } catch (error) {
      console.error("Failed to get wallets for principal:", error);
      throw error;
    }
  },

  addSigner: async (walletId: string, signerPrincipal: string) => {
    const { actor } = get();
    if (!actor) throw new Error("Actor not initialized");

    try {
      const principal = Principal.fromText(signerPrincipal);
      const result = await actor.add_signer(walletId, principal);

      if ("Ok" in result) {
        console.log("Signer added successfully:", result.Ok);
        return result.Ok;
      } else {
        throw new Error(result.Err);
      }
    } catch (error) {
      console.error("Failed to add signer:", error);
      throw error;
    }
  },

  removeSigner: async (walletId: string, signerPrincipal: string) => {
    const { actor } = get();
    if (!actor) throw new Error("Actor not initialized");

    try {
      const principal = Principal.fromText(signerPrincipal);
      const result = await actor.remove_signer(walletId, principal);

      if ("Ok" in result) {
        console.log("Signer removed successfully:", result.Ok);
        return result.Ok;
      } else {
        throw new Error(result.Err);
      }
    } catch (error) {
      console.error("Failed to remove signer:", error);
      throw error;
    }
  },

  setThreshold: async (walletId: string, threshold: number) => {
    const { actor } = get();
    if (!actor) throw new Error("Actor not initialized");

    try {
      const result = await actor.set_threshold(walletId, threshold);

      if ("Ok" in result) {
        console.log("Threshold updated successfully:", result.Ok);
        return result.Ok;
      } else {
        throw new Error(result.Err);
      }
    } catch (error) {
      console.error("Failed to set threshold:", error);
      throw error;
    }
  },

  approveMessage: async (walletId: string, messageId: string) => {
    const { actor } = get();
    if (!actor) throw new Error("Actor not initialized");

    try {
      const result = await actor.approve(walletId, messageId);

      if ("Ok" in result) {
        console.log("Message approved, current approvals:", result.Ok);
        return result.Ok;
      } else {
        throw new Error(result.Err);
      }
    } catch (error) {
      console.error("Failed to approve message:", error);
      throw error;
    }
  },

  checkCanSign: async (walletId: string, messageId: string) => {
    const { actor } = get();
    if (!actor) throw new Error("Actor not initialized");

    try {
      const canSign = await actor.can_sign(walletId, messageId);
      console.log("Can sign message:", canSign);
      return canSign;
    } catch (error) {
      console.error("Failed to check can_sign:", error);
      return false;
    }
  },

  signMessage: async (walletId: string, messageId: string) => {
    const { actor } = get();
    if (!actor) throw new Error("Actor not initialized");

    try {
      const result = await actor.sign(walletId, messageId);

      if ("Ok" in result) {
        console.log("Message signed successfully:", result.Ok);
        return result.Ok;
      } else {
        throw new Error(result.Err);
      }
    } catch (error) {
      console.error("Failed to sign message:", error);
      throw error;
    }
  },

  transfer: async (walletId: string, amount: bigint, recipient: string) => {
    const { actor } = get();
    if (!actor) throw new Error("Actor not initialized");

    try {
      const recipientPrincipal = Principal.fromText(recipient);
      const result = await actor.transfer(walletId, amount, recipientPrincipal);

      if ("Ok" in result) {
        console.log("Transfer completed successfully:", result.Ok);
        return result.Ok;
      } else {
        throw new Error(result.Err);
      }
    } catch (error) {
      console.error("Failed to transfer:", error);
      throw error;
    }
  },

  getEvmAddress: async (walletId: string) => {
    const { actor } = get();
    if (!actor) throw new Error("Actor not initialized");

    try {
      const result = await actor.get_evm_address(walletId);

      if ("Ok" in result) {
        console.log("EVM address retrieved successfully:", result.Ok);
        return result.Ok;
      } else {
        throw new Error(result.Err);
      }
    } catch (error) {
      console.error("Failed to get EVM address:", error);
      throw error;
    }
  },

  transferEvm: async (args: TransferEvmArgs) => {
    const { actor } = get();
    if (!actor) throw new Error("Actor not initialized");

    try {
      const transferArgs = {
        to: args.to,
        value: args.value,
        chain_id: args.chain_id,
        gas_limit: args.gas_limit,
        wallet_id: args.wallet_id,
        gas_price: args.gas_price,
      };

      const result = await actor.transfer_evm(transferArgs);

      if ("Ok" in result) {
        console.log("EVM transfer proposal created:", result.Ok);
        return result.Ok;
      } else {
        throw new Error(result.Err);
      }
    } catch (error) {
      console.error("Failed to transfer EVM:", error);
      throw error;
    }
  },

  getTransactionCount: async (walletId: string, chainId: bigint) => {
    const { actor } = get();
    if (!actor) throw new Error("Actor not initialized");

    try {
      const result = await actor.get_transaction_count(walletId, chainId);

      if ("Ok" in result) {
        console.log("Transaction count retrieved successfully:", result.Ok);
        return result.Ok;
      } else {
        throw new Error(result.Err);
      }
    } catch (error) {
      console.error("Failed to get transaction count:", error);
      throw error;
    }
  },

  getWalletPortfolio: async (walletId: string, chainId: bigint) => {
    const { actor } = get();
    if (!actor) throw new Error("Actor not initialized");

    try {
      const result = await actor.get_wallet_portfolio(walletId, chainId);
      return result;
    } catch (error) {
      console.error("Failed to get portfolio:", error);
      throw error;
    }
  },

  proposeBatchTransaction: async (walletId: string, batchData: any) => {
    const { actor } = get();
    if (!actor) throw new Error("Actor not initialized");

    try {
      console.log("🚀 Proposing batch transaction:", batchData);
      const result = await actor.propose_batch_transaction(walletId, batchData);
      console.log("Batch proposed successfully:", result);
      return result;
    } catch (error) {
      console.error("Failed to propose batch:", error);
      throw error;
    }
  },
});
