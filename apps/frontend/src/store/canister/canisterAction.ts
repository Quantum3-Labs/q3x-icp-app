import { Actor, HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { StateCreator } from "zustand";
import { idlFactory } from "@/assets/wallet.did";
import { CanisterState } from "./canisterState";
import { useAuthStore } from "../auth";

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
        host: process.env.NEXT_PUBLIC_REPLICA_URL,
        identity,
      });

      if (process.env.NODE_ENV === "development") {
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
});
