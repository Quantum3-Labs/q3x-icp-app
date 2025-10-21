"use client";

import React, { useState, useEffect } from "react";
import { CustomCheckbox } from "../Common/CustomCheckbox";
import { getShortenedAddress, getAccountAddressFromPrincipal } from "@/utils/helper";
import { useCanisterStore, useWalletStore } from "@/store";
import { useSubaccountsByCanisterId, useCreateSubaccount } from "@/hooks/api/useWallets";
import { CreateSubaccountDto } from "@q3x/models";
import { symbol } from "zod";

interface SubAccountSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  offset: number;
}

// Chain configuration
export const supportedChains = [
  {
    chainId: "11155111",
    chainName: "Ethereum Sepolia",
    label: "Ethereum",
    symbol: "ETH",
    icon: "/token/eth.svg",
    enabled: true,
  },
  {
    chainId: "421614",
    chainName: "Arbitrum Sepolia",
    label: "Arbitrum",
    symbol: "ETH",
    icon: "/token/arb.svg",
    enabled: true,
  },
  {
    chainId: "None",
    chainName: "Bitcoin",
    label: "Bitcoin",
    symbol: "BTC",
    icon: "/token/btc.svg",
    enabled: false,
  },
];

export default function SubAccountSidebar({ isOpen, onClose, offset }: SubAccountSidebarProps) {
  const { currentWallet } = useWalletStore();
  const { getEvmAddress } = useCanisterStore();
  const [selectedChains, setSelectedChains] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [canisterAddress, setCanisterAddress] = useState<string>(getAccountAddressFromPrincipal(currentWallet?.canisterId || ""));

  // Get existing subaccounts
  const { data: subaccounts = [] } = useSubaccountsByCanisterId(currentWallet?.canisterId || "");
  const { mutateAsync: createSubaccount } = useCreateSubaccount();

  // Get existing chain IDs
  const existingChainIds = subaccounts.map(sub => sub.chainId);

  // Auto-check existing chains
  useEffect(() => {
    console.log(getAccountAddressFromPrincipal(currentWallet?.canisterId || ""))
    if (subaccounts.length > 0) {
      setSelectedChains(existingChainIds);
    }
  }, [subaccounts]);

  const handleChainToggle = (chainId: string, checked: boolean) => {
    if (existingChainIds.includes(chainId)) {
      return;
    }

    if (checked) {
      setSelectedChains(prev => [...prev, chainId]);
    } else {
      setSelectedChains(prev => prev.filter(id => id !== chainId));
    }
  };

  const getEvmAddressFromCanister = async (walletId: string): Promise<string> => {
    try {
      const address = await getEvmAddress(walletId);
      return address;
    } catch (error) {
      console.error("Failed to get EVM address:", error);
      throw error;
    }
  };

  const handleClickAddAccounts = async () => {
    if (!currentWallet?.name) return;

    setIsCreating(true);
    try {
      // Only create subaccounts for newly selected chains
      const newChainIds = selectedChains.filter(chainId => !existingChainIds.includes(chainId));

      for (const chainId of newChainIds) {
        const chain = supportedChains.find(c => c.chainId === chainId);
        if (chain && chain.enabled) {
          // Get EVM address from canister
          const evmAddress = await getEvmAddressFromCanister(currentWallet?.name);

          // Create subaccount via backend
          const createSubAccountDto: CreateSubaccountDto = {
            chainId,
            canisterId: currentWallet?.canisterId,
            chainName: chain.chainName,
            displayName: chain.symbol,
            evmAddress,
          };
          await createSubaccount({ subaccountData: createSubAccountDto });
        }
      }

      // Close sidebar after successful creation
      onClose();
    } catch (error) {
      console.error("Failed to create subaccounts:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const enabledChains = supportedChains.filter(chain => chain.enabled);
  const upcomingChains = supportedChains.filter(chain => !chain.enabled);
  const hasNewSelections = selectedChains.some(chainId => !existingChainIds.includes(chainId));

  return (
    <div
      className="absolute top-1 h-[99%] w-[280px] bg-background border z-10 border-primary rounded-lg transition-all duration-300 ease-in-out z-50"
      style={{
        left: isOpen ? `${offset}px` : "-20px",
        transform: isOpen ? "translateX(0)" : "translateX(-100%)",
        pointerEvents: isOpen ? "auto" : "none",
        boxShadow: isOpen ? "50px 0 50px rgba(0,0,0,0.15)" : "none",
      }}
    >
      <div className="flex flex-col justify-between h-full">
        <div className="flex flex-col gap-3 p-3">
          <header className="w-full flex flex-col gap-1">
            <h1 className="text-lg font-semibold uppercase text-text-primary">Add sub account</h1>
            <span className="flex items-center gap-2 text-text-secondary">
              To <span className="text-text-primary">{currentWallet?.name}</span>{" "}
              <div className="w-fit px-2 rounded-full bg-primary text-white">
                <span className="text-white">
                  {getShortenedAddress(getAccountAddressFromPrincipal(currentWallet?.canisterId || ""))}
                </span>
              </div>
            </span>
          </header>

          <div className="flex items-center justify-center gap-2 rounded-lg bg-[#D6EDFF] p-2 text-primary">
            <img src="/misc/info-icon.svg" alt="Info" className="h-4 w-4" />
            <span className="text-primary leading-none text-sm">You can select multi kind of account to create</span>
          </div>

          <span className="text-text-secondary text-sm">Current supported chains</span>

          <div className="flex flex-col gap-4 items-start">
            {enabledChains.map(chain => {
              const isExisting = existingChainIds.includes(chain.chainId);
              const isChecked = selectedChains.includes(chain.chainId);

              return (
                <div key={chain.chainId} className="flex items-center gap-2">
                  <CustomCheckbox
                    checked={isChecked}
                    onChange={checked => handleChainToggle(chain.chainId, checked)}
                    label={chain.label}
                    icon={chain.icon}
                    disabled={isExisting}
                  />
                  {isExisting && (
                    <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">Already added</span>
                  )}
                </div>
              );
            })}
          </div>

          {upcomingChains.length > 0 && (
            <>
              <span className="text-text-secondary text-sm">Upcoming chain supported</span>
              <div className="flex flex-col gap-4 items-start">
                {upcomingChains.map(chain => (
                  <CustomCheckbox
                    key={chain.chainId}
                    checked={false}
                    onChange={() => {}}
                    label={chain.label}
                    icon={chain.icon}
                    disabled
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="flex items-center justify-center bg-[#F7F7F7] w-full h-[50px] rounded-b-lg border-t border-divider">
          <button
            onClick={handleClickAddAccounts}
            className="flex items-center justify-center gap-2 text-white px-4 py-2 rounded-lg w-[80%] leading-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background:
                hasNewSelections && !isCreating ? "linear-gradient(to bottom, #9C9C9C 0%, #303030 100%)" : "#9C9C9C",
            }}
          >
            <span className="text-white">{isCreating ? "Adding..." : "Add accounts"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
