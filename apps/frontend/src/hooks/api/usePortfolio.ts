import { useCanisterStore, useWalletStore } from "@/store";
import { PortfolioBalance } from "@q3x/models";
import { useQuery } from "@tanstack/react-query";

export const usePortfolio = () => {
  const { currentWallet, activeChainId } = useWalletStore();
  const { getWalletPortfolio } = useCanisterStore();
  
  return useQuery({
    queryKey: ['portfolio', currentWallet?.name, activeChainId],
    queryFn: async (): Promise<PortfolioBalance> => {
      if (!currentWallet?.name) throw new Error('No wallet selected');
      
      const result = await getWalletPortfolio(currentWallet.name, BigInt(activeChainId));
      
      if ('Ok' in result) {
        return result.Ok;
      } else {
        throw new Error(result.Err);
      }
    },
    enabled: !!currentWallet?.name && !!activeChainId,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};