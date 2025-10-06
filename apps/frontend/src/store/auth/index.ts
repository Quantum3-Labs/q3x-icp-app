import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { AuthState, initialAuthState } from "./authState";
import { AuthActions, createAuthActions } from "./authAction";

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set, get, store) => {
        const storeInstance = {
          ...initialAuthState,
          ...createAuthActions(set, get, store),
        };

        storeInstance.initAuthClient(); 
        return storeInstance;
      },
      {
        name: "auth-store",
        partialize: state => ({
          isAuthenticated: state.isAuthenticated,
          principal: state.principal,
        })
      },
    ),
    { name: "AuthStore" },
  ),
);
