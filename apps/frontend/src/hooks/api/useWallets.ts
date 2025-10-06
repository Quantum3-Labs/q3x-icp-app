import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  CreateWalletDto,
  Wallet,
  WalletResponseDto,
  WalletsResponseDto,
} from '@q3x/models';

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

// Query keys
export const walletKeys = {
  all: ['wallets'] as const,
  byPrincipal: (principal: string) => [...walletKeys.all, 'principal', principal] as const,
  byCanisterId: (canisterId: string) => [...walletKeys.all, 'canister', canisterId] as const,
};

// React Query hooks
export const useCreateWallet = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createWalletAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: walletKeys.all });
    },
    onError: (error) => {
      console.error('Create wallet error:', error);
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
