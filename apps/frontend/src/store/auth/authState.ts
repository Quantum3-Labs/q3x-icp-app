import { Identity } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";

export interface AuthState {
  // Auth state
  isAuthenticated: boolean;
  identity: Identity | null;
  principal: string | null;

  // Internal state
  authClient: AuthClient | null;
}

export const initialAuthState: AuthState = {
  isAuthenticated: false,
  identity: null,
  principal: null,
  authClient: null,
};
