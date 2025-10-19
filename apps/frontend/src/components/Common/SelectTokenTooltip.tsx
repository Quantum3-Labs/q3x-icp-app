"use client";

import React, { useEffect, useState } from "react";
import { useWalletStore } from "@/store";
import { usePortfolio } from "@/hooks/api/usePortfolio";
import { buildAvailableTokens, formatWeiToEther } from "@/utils/helper";
import { formatTokenBalance, getTokenName } from "@/utils/token.helper";
import { Token } from "@q3x/models";
interface SelectTokenToolTipProps {
  onTokenSelect?: (token: Token) => void;
  onClose?: () => void;
  arrowPosition?: "left" | "right";
}

export default function SelectTokenTooltip({
  onTokenSelect,
  onClose,
  arrowPosition = "left",
}: SelectTokenToolTipProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { getCurrentNetwork } = useWalletStore();
  const { data: portfolio, isLoading } = usePortfolio();

  const [availableTokens, setAvailableTokens] = useState<Token[]>([]);

  useEffect(() => {
    if (portfolio) {
      const tokens = buildAvailableTokens(portfolio, getCurrentNetwork()?.name);
      setAvailableTokens(tokens);
    }
  }, [portfolio, getCurrentNetwork]);

  const filteredTokens = availableTokens.filter(
    token =>
      token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleTokenSelect = (token: Token) => {
    console.log("🎯 Token selected:", token);
    onTokenSelect?.(token);
    onClose?.();
  };

  if (isLoading) {
    return (
      <div className="absolute bg-white rounded-[16px] w-[315px] h-[345px] shadow-[0px_0px_35.2px_0px_rgba(0,0,0,0.06)] border border-primary flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="contents relative w-full h-full">
      {/* Main tooltip container */}
      <div className="absolute bg-white rounded-[16px] w-[315px] h-[345px] shadow-[0px_0px_35.2px_0px_rgba(0,0,0,0.06)] border border-primary overflow-hidden">
        <div className="flex flex-col items-start justify-start w-full h-full">
          {/* Search section */}
          <div className="flex gap-1.5 items-center justify-start p-[16px] w-full">
            <div className="bg-[#f8f7f7] w-full min-h-px min-w-px relative rounded-[12px] border border-[#e2e2e2] shadow-[0px_1px_3px_0px_inset_rgba(18,18,18,0.1)]">
              <div className="flex gap-3 items-center justify-start p-[4px] w-full">
                <div className="bg-[#fcfcfc] flex gap-2 items-center justify-center p-[8px] rounded-[8px] shadow-[0px_0px_4px_0px_rgba(18,18,18,0.1)]">
                  <img src="/misc/search-icon.svg" alt="Search" className="w-4 h-4" />
                </div>
                <div className="flex gap-px h-8 items-center justify-start">
                  <input
                    type="text"
                    placeholder="Enter token name"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="text-[#adadad] text-[16px] outline-none placeholder:text-[#adadad] bg-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Token list section */}
          <div className="flex flex-col gap-2.5 h-full items-start justify-start w-full">
            {/* Header */}
            <div className="flex gap-0.5 items-center justify-center px-2.5 py-0 w-full">
              <div className="grow text-[#363636] text-[15px]">
                <span>Available tokens ({availableTokens.length})</span>
              </div>
              {/* <div className="text-[#363636] text-[15px] text-right">
                <span>[</span>
                <span className="font-medium text-[#1e8fff]">
                  {isICPActive() ? "ICP" : "Sepolia"}
                </span>
                <span>]</span>
              </div> */}
            </div>

            {/* Token list */}
            <div className="flex flex-col w-full overflow-y-auto h-full">
              {filteredTokens.length === 0 ? (
                <div className="flex items-center justify-center p-4 text-gray-500">No tokens found</div>
              ) : (
                filteredTokens.map(token => (
                  <div
                    key={token.id}
                    onClick={() => handleTokenSelect(token)}
                    className={`flex gap-[7px] items-center justify-start py-2 px-3 w-full cursor-pointer hover:bg-gray-50 transition-colors 
                      `}
                    // ${ token.isSelected ? "bg-[#edf8ff]" : "bg-white"}
                  >
                    {/* Token icon */}
                    <div className="w-8 h-8">
                      <img
                        src={token.icon}
                        alt={token.name}
                        className="w-full h-full"
                        // onError={(e) => {
                        //   (e.target as HTMLImageElement).src = "/token/default.svg";
                        // }}
                      />
                    </div>

                    {/* Token info */}
                    <div className="flex flex-col grow items-start justify-center">
                      <div className="font-medium text-[#363636] text-[14px] w-full">{token.name}</div>
                      <div className="text-[#676767] text-[12px] w-full">{token.symbol}</div>
                    </div>

                    {/* Balance info */}
                    <div className="flex flex-col grow items-end justify-center text-right">
                      {/* <div className="font-medium text-[#363636] text-[14px] w-full">
                        <span className="text-[#c8c8c8]">US$ </span>
                        <span>{token.usdValue}</span>
                      </div> */}
                      <div className="text-[#676767] text-[12px] w-full">{token.balance}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Arrow pointer */}
      <div
        className={`absolute flex items-center justify-center w-[15px] top-3 ${
          arrowPosition === "left" ? "left-[318px]" : "right-[2px] rotate-180"
        }`}
      >
        <img src="/arrow/filled-triangle-right.svg" alt="Filled triangle right" className="w-full h-full" />
      </div>
    </div>
  );
}
