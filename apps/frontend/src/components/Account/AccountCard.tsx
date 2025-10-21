"use client";
import React, { useState } from "react";
import { NetworkItem } from "./NetworkItem";
import { Network } from "./AccountSidebar";
import { copyAddressToClipboard, getShortenedAddress } from "@/utils/helper";

interface AccountCardProps {
  accountName: string;
  accountAddress: string;
  canisterId: string;
  accountIcon: string;
  networks?: Network[];
  showSubAccountButton?: boolean;
  isExpanded?: boolean;
  isCurrentAccount?: boolean;
  activeChainId?: string;
  onSubAccountClick?: () => void;
  onSwitchClick?: () => void;
  onNetworkSwitch?: (network: Network) => void;
}

export function AccountCard({
  accountName,
  accountAddress,
  canisterId,
  accountIcon,
  networks = [],
  showSubAccountButton = false,
  isExpanded: controlledExpanded,
  isCurrentAccount,
  activeChainId,
  onSubAccountClick,
  onSwitchClick,
  onNetworkSwitch,
}: AccountCardProps) {
  const [internalExpanded, setInternalExpanded] = React.useState(false);
  const [isAnimating, setIsAnimating] = React.useState(false);
  const isExpanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded;

  const handleNetworkSelect = (networkName: string) => {
    const selectedNetwork = networks.find(network => network.name === networkName);
    if (selectedNetwork && onNetworkSwitch) {
      onNetworkSwitch(selectedNetwork);
    }
  };

  const handleToggle = () => {
    const newExpanded = !isExpanded;
    setIsAnimating(true);
    setInternalExpanded(newExpanded);

    // Reset animating state after animation completes
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <article className="w-full rounded-xl border border-divider">
      <header
        className={`flex items-center justify-between px-2 py-2 pr-5 cursor-pointer hover:bg-neutral-50 transition-colors ${
          !isExpanded ? "border-b-0" : "border-b border-divider"
        } ${isCurrentAccount ? "bg-blue-50" : ""}`}
        onClick={handleToggle}
      >
        <div className="flex items-start gap-1.5">
          <img src={accountIcon} alt={`${accountName} icon`} className="h-[35px] w-[35px]  rounded-full " />
          <div className="flex w-[92px] flex-col gap-2 justify-center">
            <h3 className="text-base leading-none tracking-tight text-text-primary">{accountName}</h3>
            <div className="flex items-center justify-center rounded-full bg-primary text-xs w-fit px-2 text-white" onClick={e => {
              e.stopPropagation();
              copyAddressToClipboard(canisterId);
            }}>
              <span>{getShortenedAddress(canisterId)}</span>
            </div>
          </div>
        </div>
        <img
          src="/arrow/caret-down.svg"
          alt="Expand account"
          className={` h-4 w-4 transition-transform duration-200 ${!isExpanded ? "rotate-180" : ""}`}
        />
      </header>

      <div
        className={`transition-all duration-300 ease-in-out ${
          isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {(isExpanded || isAnimating) && (
          <>
            {!isCurrentAccount && (
              <button
                onClick={onSwitchClick}
                className="flex w-full items-center justify-center gap-2 rounded-xl px-5 py-2 text-sm leading-tight tracking-tight text-white shadow cursor-pointer bg-gradient-to-b from-[#48b3ff] to-[#0059ff]"
              >
                <span>Switch</span>
              </button>
            )}
            {isCurrentAccount && (
              <div className="flex w-full items-center justify-center gap-2 rounded-xl px-5 py-2 text-sm leading-tight tracking-tight text-gray-500 bg-gray-100">
                <span>Current Account</span>
              </div>
            )}
            <section className="w-full p-1.5">
              {networks.map((network, index) => (
                <NetworkItem
                  key={index}
                  icon={network.icon}
                  name={network.name}
                  symbol={network.name.includes("Arbitrum") ? 'arb' : network.symbol}
                  address={network.address}
                  isDefault={network.isDefault}
                  isActive={network.chainId === activeChainId}
                  onNetworkSelect={handleNetworkSelect}
                />
              ))}
            </section>

            {showSubAccountButton && isCurrentAccount && (
              <footer className="w-full border-t border-neutral-200 bg-neutral-100 p-1.5">
                <button
                  className="flex w-full items-center justify-center gap-2 rounded-xl px-5 py-1.5 text-sm leading-tight tracking-tight text-white shadow cursor-pointer"
                  style={{
                    background: "linear-gradient(180deg, #E6A7FF 0%, #C43EF7 100%)",
                    boxShadow: "0 4px 12px #EEC1F7",
                  }}
                  onClick={() => {
                    onSubAccountClick?.();
                  }}
                >
                  <span>New sub account</span>
                </button>
              </footer>
            )}
          </>
        )}
      </div>
    </article>
  );
}
