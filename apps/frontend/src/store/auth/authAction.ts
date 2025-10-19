import { AuthClient } from "@dfinity/auth-client";
import { StateCreator } from "zustand";
import { AuthState } from "./authState";
import { useWalletStore } from "../wallet";

export interface AuthActions {
  login: () => Promise<void>;
  logout: () => Promise<boolean>;
  initAuthClient: () => Promise<void>;
}

export const createAuthActions: StateCreator<AuthState & AuthActions, [], [], AuthActions> = (set, get, store) => ({
  initAuthClient: async () => {
    try {
      const client = await AuthClient.create({});
      set({ authClient: client });

      const isAuthenticated = await client.isAuthenticated();

      if (isAuthenticated) {
        const identity = client.getIdentity();
        const principal = identity.getPrincipal().toString();
        set({
          isAuthenticated: true,
          identity,
          principal,
        });
      }
    } catch (error) {
      console.error("Failed to initialize auth client:", error);
    }
  },

  login: async () => {
    const { authClient } = get();
    if (!authClient) return;

    try {
      await authClient.login({
        identityProvider: process.env.NEXT_PUBLIC_CANISTER_ID_INTERNET_IDENTITY,
        onSuccess: () => {
          const identity = authClient.getIdentity();
          const principal = identity.getPrincipal().toString();

          set({
            identity,
            principal,
            isAuthenticated: true,
          });

          useWalletStore.getState().clearCurrentWallet();
        },
        onError: error => {
          console.error("Login failed:", error);
        },
      });
    } catch (error) {
      console.error("Login error:", error);
    }
  },

  logout: async () => {
    const { authClient } = get();
    if (!authClient) return false;

    try {
      await authClient.logout();

      set({
        identity: null,
        principal: null,
        isAuthenticated: false,
      });

      useWalletStore.getState().clearCurrentWallet();

      if ("indexedDB" in window) {
        try {
          indexedDB.deleteDatabase("auth-client-db");
        } catch (e) {
          console.warn("Could not clear II IndexedDB:", e);
        }
      }
      return true;
    } catch (error) {
      console.error("Logout error:", error);
      return false;
    }
  },
});
