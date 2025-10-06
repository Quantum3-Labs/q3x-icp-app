"use client";

import React, { useState, useEffect } from "react";
import { AccountCard } from "./AccountCard";
import SubAccountSidebar from "./SubAccountSidebar";
import { ACCOUNT_SIDEBAR_OFFSET, NEW_SUB_ACCOUNT_SIDEBAR_OFFSET } from "../Common/Sidebar";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getAccountAddressFromPrincipal } from "@/utils/helper";
import { DEFAULT_CANISTER } from "@/constants";
import { Wallet } from "@q3x/models";
import { useWalletsByPrincipal } from "@/hooks/api/useWallets";
import { useAuthStore, useWalletStore } from "@/store";

interface AccountSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const mainAccountNetworks = [
  {
    icon: "/logo/icp-avatar.svg",
    name: "ICP",
    address: "0xB...37e",
    isDefault: true,
    isActive: true,
  },
  {
    icon: "/token/arbitrum.svg",
    name: "Arbitrum",
    address: "0xb...AK9",
    isDefault: false,
    isActive: false,
  },
  {
    icon: "/token/btc.svg",
    name: "Bitcoin",
    address: "0xD...ad8",
    isDefault: false,
    isActive: false,
  },
  {
    icon: "/token/eth.svg",
    name: "Ethereum",
    address: "0xE...Bbe",
    isDefault: false,
    isActive: false,
  },
];

export default function AccountSidebar({ isOpen, onClose }: AccountSidebarProps) {
  const [showSubAccountSidebar, setShowSubAccountSidebar] = useState(false);
  const { principal } = useAuthStore();
  const {currentWallet, setCurrentWallet} = useWalletStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const canisterIdFromUrl = searchParams.get("canisterid");

  const { data: userWallets = [] } = useWalletsByPrincipal(principal || "");
  
  const handleSwitchWallet = (wallet: Wallet) => {
    setCurrentWallet(wallet);
    router.push(`/dashboard?canisterid=${wallet.canisterId}`);
    onClose();
  };
  
  useEffect(() => {
    if (userWallets.length > 0) {
      const firstWallet = userWallets[0] || null;
      if (principal && pathname.startsWith("/dashboard") && (canisterIdFromUrl || firstWallet?.canisterId)) {
        router.push(`/dashboard?canisterid=${canisterIdFromUrl || firstWallet?.canisterId}`);
      }
    }
  }, [principal, userWallets.length > 0]);

  // Close sub-account sidebar when main sidebar closes
  useEffect(() => {
    if (!isOpen) {
      setShowSubAccountSidebar(false);
    }
  }, [isOpen]);

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

        <button className="flex justify-center items-center px-5 py-2 w-full text-base font-semibold text-center rounded-xl shadow bg-primary border border-[#3151D3]">
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
          key={canisterIdFromUrl || "default-account"}
          accountName={currentWallet?.name || "Default Account"}
          accountAddress={`${getAccountAddressFromPrincipal(currentWallet?.canisterId || "").slice(
            0,
            8,
          )}...${getAccountAddressFromPrincipal(currentWallet?.canisterId || "").slice(-8)}`}
          accountIcon="/account/default-avatar.svg"
          isCurrentAccount={true}
        />
        {userWallets.map(wallet => {
          if (wallet.canisterId === currentWallet?.canisterId) return null;
          return (
            <AccountCard
              key={wallet.canisterId}
              accountName={wallet?.name ?? ""}
              accountAddress={`${getAccountAddressFromPrincipal(wallet.canisterId || DEFAULT_CANISTER).slice(
                0,
                8,
              )}...${getAccountAddressFromPrincipal(wallet.canisterId || DEFAULT_CANISTER).slice(-8)}`}
              accountIcon="/account/default-avatar.svg"
              isCurrentAccount={false}
              onSwitchClick={() => handleSwitchWallet(wallet)}
            />
          );
        })}
        {/* <AccountCard
          accountName="Account 1"
          accountAddress="0xB...37e"
          accountIcon="/account/default-avatar.svg"
          // networks={mainAccountNetworks}
          // showSubAccountButton={true}
          // onSubAccountClick={() => setShowSubAccountSidebar(true)}
        /> */}
      </div>

      <SubAccountSidebar
        isOpen={showSubAccountSidebar}
        onClose={() => setShowSubAccountSidebar(false)}
        offset={NEW_SUB_ACCOUNT_SIDEBAR_OFFSET}
      />
    </>
  );
}
