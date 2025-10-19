import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CreateSubaccountDto,
  CreateSubaccountResponseDto,
  CreateWalletDto,
  SubaccountsResponseDto,
  Wallet,
  WalletChain,
  WalletResponseDto,
  WalletsResponseDto,
} from "@q3x/models";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// API functions
const createWalletAPI = async (walletData: CreateWalletDto): Promise<WalletResponseDto> => {
  const response = await fetch(`${API_BASE_URL}/api/wallets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(walletData),
  });

  if (!response.ok) {
    throw new Error(`Backend Error: ${response.statusText}`);
  }

  return response.json();
};

const getWalletsByPrincipal = async (principal: string): Promise<Wallet[]> => {
  const response = await fetch(`${API_BASE_URL}/api/wallets?principal=${principal}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch wallets: ${response.statusText}`);
  }

  const result: WalletsResponseDto = await response.json();

  if (!result.success) {
    throw new Error("API returned error");
  }

  return result.data;
};

const getWalletByCanisterId = async (canisterId: string): Promise<Wallet> => {
  if (!canisterId) {
    throw new Error("Canister ID is required");
  }
  const response = await fetch(`${API_BASE_URL}/api/wallets/${canisterId}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch wallet: ${response.statusText}`);
  }

  const result: WalletResponseDto = await response.json();

  if (!result.success) {
    throw new Error("API returned error");
  }

  return result.data;
};

// Subaccount API functions
const createSubaccountAPI = async (subaccountData: CreateSubaccountDto): Promise<WalletChain> => {
  const response = await fetch(`${API_BASE_URL}/api/wallets/chains`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(subaccountData),
  });

  if (!response.ok) {
    throw new Error(`Backend Error: ${response.statusText}`);
  }

  const result: CreateSubaccountResponseDto = await response.json();

  if (!result.success) {
    throw new Error(result.message || "API returned error");
  }

  return result.data;
};

const getSubaccountsByWalletId = async (walletId: string): Promise<WalletChain[]> => {
  if (!walletId) {
    throw new Error("Wallet ID is required");
  }

  const response = await fetch(`${API_BASE_URL}/api/wallets/${walletId}/chains`);

  if (!response.ok) {
    throw new Error(`Failed to fetch subaccounts: ${response.statusText}`);
  }

  const result: SubaccountsResponseDto = await response.json();

  if (!result.success) {
    throw new Error("API returned error");
  }

  return result.data;
};

const addSignerAPI = async (walletId: string, principal: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/api/wallets/${walletId}/signers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ principal }),
  });

  if (!response.ok) {
    throw new Error(`Failed to add signer: ${response.statusText}`);
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.message || "API returned error");
  }
};

const removeSignerAPI = async (walletId: string, principal: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/api/wallets/${walletId}/signers/${principal}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Failed to remove signer: ${response.statusText}`);
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.message || "API returned error");
  }
};

// Query keys
export const walletKeys = {
  all: ["wallets"] as const,
  byPrincipal: (principal: string) => [...walletKeys.all, "principal", principal] as const,
  byCanisterId: (canisterId: string) => [...walletKeys.all, "canister", canisterId] as const,
  subaccounts: (walletId: string) => [...walletKeys.all, "subaccounts", walletId] as const,
  signers: (walletId: string) => [...walletKeys.all, "signers", walletId] as const,
};

// React Query hooks
export const useCreateWallet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createWalletAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: walletKeys.all });
    },
    onError: error => {
      console.error("Create wallet error:", error);
    },
  });
};

export const useWalletsByPrincipal = (principal: string) => {
  return useQuery({
    queryKey: walletKeys.byPrincipal(principal),
    queryFn: () => getWalletsByPrincipal(principal),
    enabled: !!principal,
  });
};

export const useWalletByCanisterId = (canisterId: string) => {
  return useQuery({
    queryKey: walletKeys.byCanisterId(canisterId),
    queryFn: () => getWalletByCanisterId(canisterId),
    enabled: !!canisterId,
  });
};

export const useCreateSubaccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ subaccountData }: { subaccountData: CreateSubaccountDto }) => createSubaccountAPI(subaccountData),
    onSuccess: (_, { subaccountData }) => {
      // Invalidate subaccounts for this wallet
      queryClient.invalidateQueries({ queryKey: walletKeys.subaccounts(subaccountData.walletId) });
      // Also invalidate all wallets in case we need to refresh wallet data
      queryClient.invalidateQueries({ queryKey: walletKeys.all });
    },
    onError: error => {
      console.error("Create subaccount error:", error);
    },
  });
};

export const useSubaccountsByWalletId = (walletId: string) => {
  return useQuery({
    queryKey: walletKeys.subaccounts(walletId),
    queryFn: () => getSubaccountsByWalletId(walletId),
    enabled: !!walletId,
  });
};

export const useAddSigner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ walletId, principal }: { walletId: string; principal: string }) => addSignerAPI(walletId, principal),
    onSuccess: (_, { walletId }) => {
      // Invalidate wallet data to refresh signers
      queryClient.invalidateQueries({ queryKey: walletKeys.all });
      queryClient.invalidateQueries({ queryKey: walletKeys.signers(walletId) });
    },
    onError: error => {
      console.error("Add signer error:", error);
    },
  });
};

export const useRemoveSigner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ walletId, principal }: { walletId: string; principal: string }) =>
      removeSignerAPI(walletId, principal),
    onSuccess: (_, { walletId }) => {
      // Invalidate wallet data to refresh signers
      queryClient.invalidateQueries({ queryKey: walletKeys.all });
      queryClient.invalidateQueries({ queryKey: walletKeys.signers(walletId) });
    },
    onError: error => {
      console.error("Remove signer error:", error);
    },
  });
};
