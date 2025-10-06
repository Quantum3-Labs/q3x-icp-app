"use client";

import React, { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";
import SelectTokenTooltip from "../Common/SelectTokenTooltip";
import SelectAddressTooltip from "../Common/SelectAddressTooltip";

export default function SendContainer() {
  const [showTokenTooltip, setShowTokenTooltip] = useState(false);
  const [showAddressTooltip, setShowAddressTooltip] = useState(false);
  const [selectedToken, setSelectedToken] = useState({
    id: "icp",
    name: "ICP",
    symbol: "ICP",
    icon: "/misc/coin-icon.gif",
    balance: "0",
    usdValue: "0",
  });
  const [selectedAddress, setSelectedAddress] = useState<{
    id: string;
    name: string;
    company: string;
    address: string;
    icon: string;
  } | null>(null);

  const handleTokenSelect = (token: any) => {
    setSelectedToken(token);
    setShowTokenTooltip(false);
  };

  const handleAddressSelect = (address: any) => {
    setSelectedAddress(address);
    setAddress(address.address);
    setShowAddressTooltip(false);
  };

  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest("[data-tooltip-id]") && !target.closest(".tooltip-content")) {
        setShowTokenTooltip(false);
        setShowAddressTooltip(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="overflow-hidden relative w-full h-full flex flex-col rounded-lg">
      {/* Earth background images */}
      <div className="absolute -top-70 flex h-[736.674px] items-center justify-center left-1/2 translate-x-[-50%] w-[780px] pointer-events-none">
        <img src="/send/top-globe.svg" alt="Bottom globe" className="w-full h-full" />
      </div>
      <div className="absolute -bottom-70 flex h-[736.674px] items-center justify-center left-1/2 translate-x-[-50%] w-[780px] pointer-events-none">
        <img src="/send/bottom-globe.svg" alt="Bottom globe" className="w-full h-full" />
      </div>

      {/* Main content */}
      <div className="flex flex-col gap-[20px] items-center justify-center flex-1 px-4">
        {/* Title section */}
        <div className="flex flex-col items-center justify-center pt-8">
          <div className="text-[#545454] text-6xl text-center font-bold uppercase w-full">sending</div>
          <div className="flex gap-[5px] items-center justify-center w-full">
            <div className="text-[#545454] text-6xl text-center font-bold uppercase">t</div>
            <div className="h-[48px] relative rounded-full w-[125.07px] border-[4.648px] border-primary border-solid"></div>
            <div className="text-[#545454] text-6xl text-center font-bold uppercase">friends</div>
          </div>
        </div>
        {/* Token selector and amount */}
        <div className="flex gap-1 items-center justify-center w-full max-w-md">
          {/* Token selector */}
          <div
            className="bg-white flex gap-1 items-center justify-start pl-1.5 pr-0.5 py-0.5 rounded-full border border-[#e0e0e0] cursor-pointer"
            data-tooltip-id="token-selector-tooltip"
            onClick={() => setShowTokenTooltip(true)}
          >
            <img src="/arrow/caret-down.svg" alt="Address book" className="w-5 h-5" />
            <img src={selectedToken.icon} alt={selectedToken.name} className="w-9 h-9" />
          </div>

          {/* Token selection tooltip */}
          <Tooltip
            id="token-selector-tooltip"
            isOpen={showTokenTooltip}
            place="left"
            openOnClick={true}
            border="1px solid #0059ff"
            className="!bg-transparent !border-0 !shadow-none !p-0 !-mt-5"
            clickable={true}
            opacity={1}
            style={{
              zIndex: 10,
            }}
            noArrow={true}
            offset={340}
            render={() => (
              <SelectTokenTooltip onTokenSelect={handleTokenSelect} onClose={() => setShowTokenTooltip(false)} />
            )}
          />

          {/* Amount display */}
          <input
            type="text"
            value={amount}
            placeholder="0.00"
            onChange={e => setAmount(e.target.value)}
            className="text-text-primary text-[44px] uppercase outline-none w-[90px]"
          />
        </div>

        {/* Visual divider with "To" indicator */}
        <div className="flex flex-col gap-2.5 items-center justify-center w-full max-w-md h-[100px] relative">
          <div className="h-[75.46px] w-full max-w-[528px] flex items-center justify-center relative">
            <div className="relative w-full h-full">
              <div className="absolute left-1/2 top-0 w-0.5 h-full border-l border-dashed border-gray-300 transform -translate-x-1/2" />
              <div className="absolute left-0 top-1/2 w-full h-0.5 border-t border-dashed border-gray-300 transform -translate-y-1/2" />
            </div>
            <div className="absolute bg-[#f4f4f6] rounded-[32.842px] w-8 h-8 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
              <div className="text-text-secondary text-[16px] text-center">To</div>
              <div
                className={`absolute border-[0.842px] border-dashed inset-[-0.842px] pointer-events-none rounded-[33.6841px] shadow-[0px_4px_33.5px_0px_rgba(26,32,111,0.29)] transition-colors duration-300 ease-in-out ${
                  selectedToken.id !== "icp" && amount.trim() !== "" ? "border-[#0059ff]" : "border-[#c8c8c8]"
                }`}
              ></div>

              {/* Arrow indicators pointing outward */}
              <div
                className={`absolute w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] transition-colors duration-300 ease-in-out ${
                  selectedToken.id !== "icp" && amount.trim() !== "" ? "border-b-[#0059ff]" : "border-b-[#c8c8c8]"
                } top-[-8px] left-1/2 transform -translate-x-1/2`}
              ></div>
              <div
                className={`absolute w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] transition-colors duration-300 ease-in-out ${
                  selectedToken.id !== "icp" && amount.trim() !== "" ? "border-t-[#0059ff]" : "border-t-[#c8c8c8]"
                } bottom-[-8px] left-1/2 transform -translate-x-1/2`}
              ></div>
              <div
                className={`absolute w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[8px] transition-colors duration-300 ease-in-out ${
                  selectedToken.id !== "icp" && amount.trim() !== "" ? "border-l-[#0059ff]" : "border-l-[#c8c8c8]"
                } right-[-8px] top-1/2 transform -translate-y-1/2`}
              ></div>
              <div
                className={`absolute w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[8px] transition-colors duration-300 ease-in-out ${
                  selectedToken.id !== "icp" && amount.trim() !== "" ? "border-r-[#0059ff]" : "border-r-[#c8c8c8]"
                } left-[-8px] top-1/2 transform -translate-y-1/2`}
              ></div>
            </div>
          </div>
        </div>

        {/* Address input */}
        <div className="flex flex-col gap-[5px] items-center justify-start w-full max-w-xl">
          <div className="flex gap-2.5 items-center justify-center w-full">
            <div className="bg-white grow min-h-px min-w-px relative rounded-[16px] border border-[#e0e0e0] shadow-[0px_0px_10.3px_0px_rgba(135,151,255,0.14),0px_0px_89.5px_0px_rgba(0,0,0,0.05)] p-3 justify-between flex-row flex">
              <input
                type="text"
                placeholder="Enter address"
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="text-text-secondary text-[16px] outline-none placeholder:text-text-secondary flex-3"
              />
              {selectedAddress?.name && (
                <div className="text-text-secondary text-[16px] flex-1 flex flex-row items-center justify-end">
                  [<span className="text-primary">{selectedAddress.name}</span>]
                </div>
              )}
            </div>
            <img
              src="/send/address-book-icon.svg"
              alt="Address book"
              className="w-5 h-5 cursor-pointer"
              data-tooltip-id="address-selector-tooltip"
              onClick={() => setShowAddressTooltip(true)}
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 items-center justify-center w-full max-w-xs">
          <button className="bg-gradient-to-b from-[#e6a7ff] to-[#c43ef7] flex items-center justify-center px-5 py-2 rounded-[10px] shadow-[0px_2px_4px_-1px_rgba(231,113,255,0.5),0px_0px_0px_1px_#ed66ff] flex-1">
            <span className="font-semibold text-[16px] text-center text-white tracking-[-0.16px]">Add to batch</span>
          </button>
          <button className="bg-gradient-to-b from-[#48b3ff] to-[#0059ff] flex items-center justify-center px-5 py-2 rounded-[10px] shadow-[0px_2px_4px_-1px_rgba(12,12,106,0.5),0px_0px_0px_1px_#4470ff] flex-1">
            <span className="font-semibold text-[16px] text-center text-white tracking-[-0.16px]">Send now</span>
          </button>
        </div>

        {/* Address selection tooltip */}
        <Tooltip
          id="address-selector-tooltip"
          isOpen={showAddressTooltip}
          place="left"
          openOnClick={true}
          border="1px solid #0059ff"
          className="!bg-transparent !border-0 !shadow-none !p-0 !-mt-45"
          clickable={true}
          opacity={1}
          style={{
            zIndex: 10,
          }}
          noArrow={true}
          offset={340}
          render={() => (
            <SelectAddressTooltip onAddressSelect={handleAddressSelect} onClose={() => setShowAddressTooltip(false)} />
          )}
        />
      </div>
    </div>
  );
}
