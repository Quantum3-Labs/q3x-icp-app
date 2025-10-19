"use client";

import React, { useState, useEffect } from "react";
import { AccountCard } from "./AccountCard";
import SubAccountSidebar from "./SubAccountSidebar";
import { ACCOUNT_SIDEBAR_OFFSET, NEW_SUB_ACCOUNT_SIDEBAR_OFFSET } from "../Common/Sidebar";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getAccountAddressFromPrincipal, getShortenedAddress } from "@/utils/helper";
import { DEFAULT_CANISTER } from "@/constants";
import { Wallet, WalletChain } from "@q3x/models";
import { useSubaccountsByWalletId, useWalletsByPrincipal } from "@/hooks/api/useWallets";
import { useAuthStore, useWalletStore } from "@/store";
import { symbol } from "zod";

interface AccountSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface Network {
  icon: string;
  name: string;
  address: string;
  symbol: string;
  isDefault?: boolean;
  chainId?: string;
  displayName?: string;
}

export default function AccountSidebar({ isOpen, onClose }: AccountSidebarProps) {
  const [showSubAccountSidebar, setShowSubAccountSidebar] = useState(false);
  const { principal } = useAuthStore();
  const {
    currentWallet,
    setCurrentWallet,
    subaccounts,
    setSubaccounts,
    switchToNetwork,
    activeChainId,
    getCurrentNetwork,
  } = useWalletStore();
  const router = useRouter();

  const { data: userWallets = [] } = useWalletsByPrincipal(principal || "");
  const { data: fetchedSubaccounts = [] } = useSubaccountsByWalletId(currentWallet?.name || "");

  const [currentWalletNetworks, setCurrentWalletNetworks] = useState<Network[]>([]);

  // Create dynamic networks based on real subaccounts
  const createNetworksFromSubaccounts = (subaccounts: WalletChain[]) => {
    // Default ICP account (always first)
    const icpAccount = {
      icon: "/logo/icp-avatar.svg",
      name: "ICP",
      address: getAccountAddressFromPrincipal(currentWallet?.canisterId || ""),
      isDefault: true,
      isActive: true,
      chainId: "0", // ICP doesn't have EVM chain ID
      displayName: "ICP",
      symbol: "ICP",
    };

    // Convert subaccounts to network format
    const evmNetworks = subaccounts.map(subaccount => ({
      icon: getChainIcon(subaccount.chainId),
      name: subaccount.chainName,
      address: subaccount.evmAddress,
      isDefault: false,
      isActive: false,
      chainId: subaccount.chainId,
      displayName: subaccount.displayName,
      symbol: subaccount.displayName,
    }));

    return [icpAccount, ...evmNetworks];
  };

  const getChainIcon = (chainId: string) => {
    const iconMap: Record<string, string> = {
      "1": "/token/eth.svg",
      "11155111": "/token/eth.svg", // Sepolia
      "42161": "/token/arbitrum.svg", // Arbitrum
      "8453": "/token/base.svg", // Base
      "10": "/token/optimism.svg", // Optimism
    };
    return iconMap[chainId] || "/token/eth.svg"; // Default to ETH
  };

  const handleSwitchWallet = (wallet: Wallet) => {
    setCurrentWallet(wallet);
    onClose();
  };

  const handleNetworkSwitch = (network: Network) => {
    switchToNetwork(network.chainId || "0");
  };

  useEffect(() => {
    if (userWallets.length > 0) {
      const firstWallet = userWallets[0] || null;
      if (!currentWallet) {
        setCurrentWallet(firstWallet);
      }
    }
  }, [principal, userWallets.length > 0]);

  // Close sub-account sidebar when main sidebar closes
  useEffect(() => {
    if (!isOpen) {
      setShowSubAccountSidebar(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const currentWalletNetworks = createNetworksFromSubaccounts(fetchedSubaccounts);
    setCurrentWalletNetworks(currentWalletNetworks);

    if (fetchedSubaccounts.length > 0) {
      setSubaccounts(fetchedSubaccounts);
    }
  }, [fetchedSubaccounts.length, currentWallet?.canisterId]);

  return (
    <>
      <div
        className="absolute top-1 h-[99%] w-[280px] bg-background border z-20 border-primary rounded-lg p-3 flex flex-col gap-2 transition-all duration-300 ease-in-out"
        style={{
          left: isOpen ? `${ACCOUNT_SIDEBAR_OFFSET}px` : "-20px",
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
          pointerEvents: isOpen ? "auto" : "none",
          boxShadow: isOpen && !showSubAccountSidebar ? "50px 0 50px rgba(0,0,0,0.15)" : "none",
        }}
      >
        <header className="w-full flex flex-col gap-1">
          <h1 className="text-lg font-semibold  uppercase text-text-primary">your accounts</h1>
          <p className="text-base tracking-tight leading-4 text-text-secondary">
            Below are your accounts and sub-accounts
          </p>
        </header>

        <button className="flex justify-center items-center px-5 py-2 w-full text-base font-semibold text-center rounded-xl shadow bg-primary border border-[#3151D3] cursor-pointer">
          <span
            className="text-white"
            onClick={() => {
              onClose();
              router.push("/dashboard/new-account");
            }}
          >
            Create new account
          </span>
        </button>

        <AccountCard
          key={currentWallet?.canisterId || "default-account"}
          accountName={currentWallet?.name || "Default Account"}
          accountAddress={`${(getAccountAddressFromPrincipal(currentWallet?.canisterId || ""))}`}
          accountIcon="/account/default-avatar.svg"
          isCurrentAccount={true}
          networks={currentWalletNetworks}
          showSubAccountButton={true}
          onSubAccountClick={() => setShowSubAccountSidebar(true)}
          onNetworkSwitch={handleNetworkSwitch}
          activeChainId={activeChainId}
        />
        {userWallets.map(wallet => {
          if (wallet.canisterId === currentWallet?.canisterId) return null;
          return (
            <AccountCard
              key={wallet.canisterId}
              accountName={wallet?.name ?? ""}
              accountAddress={`${(getAccountAddressFromPrincipal(wallet?.canisterId || ""))}`}
              accountIcon="/account/default-avatar.svg"
              isCurrentAccount={false}
              onSwitchClick={() => handleSwitchWallet(wallet)}
              showSubAccountButton={true}
              onSubAccountClick={() => setShowSubAccountSidebar(true)}
            />
          );
        })}
      </div>

      <SubAccountSidebar
        isOpen={showSubAccountSidebar}
        onClose={() => setShowSubAccountSidebar(false)}
        offset={NEW_SUB_ACCOUNT_SIDEBAR_OFFSET}
      />
    </>
  );
}
