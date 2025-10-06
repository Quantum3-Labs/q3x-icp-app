"use client";

import React, { useState } from "react";

interface AccountProps {
  className?: string;
  onAccountNameChange: (name: string) => void;
  onNextStep: () => void;
  accountName: string;
}

export default function Account({ 
  className, 
  onAccountNameChange, 
  onNextStep, 
  accountName 
}: AccountProps) {
  const [showAddressTooltip, setShowAddressTooltip] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<{
    id: string;
    name: string;
    company: string;
    address: string;
    icon: string;
  } | null>(null);

  const handleAddressSelect = (address: any) => {
    setSelectedAddress(address);
    onAccountNameChange(address.address);
    setShowAddressTooltip(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onAccountNameChange(e.target.value);
  };

  const handleNextClick = () => {
    if (accountName.trim()) {
      onNextStep();
    }
  };

  return (
    <div
      className={`overflow-hidden relative w-full h-full flex flex-col rounded-lg bg-background ${className} border border-divider`}
    >
      {/* Earth background images */}
      <div className="w-full relative">
        <div className="absolute top-0 flex h-[736.674px] items-center justify-center left-1/2 translate-x-[-50%] w-[780px] pointer-events-none">
          <img src="/send/top-globe.svg" alt="Bottom globe" className="w-full h-full" />
        </div>
        <div className="absolute top-10 left-0 right-0 h-[400px] w-full bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
      </div>

      {/* Main content */}
      <div className="flex flex-col gap-[20px] items-center justify-center flex-1 px-4 relative z-10">
        {/* Title section */}
        <div className="flex flex-col items-center justify-center pb-8">
          <div className="text-[#545454] text-6xl text-center font-bold uppercase w-full">create new</div>
          <div className="flex gap-[5px] items-center justify-center w-full">
            <div className="text-[#545454] text-6xl text-center font-bold uppercase">acc</div>
            <div className="h-[48px] relative rounded-full w-[125.07px] border-[4.648px] border-primary border-solid"></div>
            <div className="text-[#545454] text-6xl text-center font-bold uppercase">unt</div>
          </div>
        </div>

        {/* Basic setup */}
        <div className="flex items-center justify-center w-full max-w-2xl flex-col text-center">
          <span className="text-text-primary uppercase text-[26px] font-bold">1. Basic setup</span>
          <span className="text-text-secondary text-[16px]">
            This is the basic setup of the account, please enter the account name in the box below.
          </span>
          <span className="text-text-secondary text-[16px]">
            Or click the generate button next to it to automatically generate the account name.
          </span>
        </div>

        {/* Address input */}
        <div className="flex flex-col gap-[5px] items-center justify-start w-full max-w-lg">
          <div className="flex gap-2.5 items-center justify-center w-full">
            <div className="bg-white grow min-h-px min-w-px relative rounded-[16px] border border-[#e0e0e0] shadow-[0px_0px_10.3px_0px_rgba(135,151,255,0.14),0px_0px_89.5px_0px_rgba(0,0,0,0.05)] p-3 justify-between flex-row flex">
              <input
                type="text"
                placeholder="Your account name"
                value={accountName}
                onChange={handleInputChange}
                className="text-text-secondary text-[16px] outline-none placeholder:text-text-secondary flex-3"
              />
              {selectedAddress?.name && (
                <div className="text-text-secondary text-[16px] flex-1 flex flex-row items-center justify-end">
                  [<span className="text-primary">{selectedAddress.name}</span>]
                </div>
              )}
            </div>
            <img
              src="/swap/swap-icon.svg"
              alt="Address book"
              className="w-5 h-5 cursor-pointer"
              data-tooltip-id="address-selector-tooltip"
              onClick={() => setShowAddressTooltip(true)}
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 items-center justify-center w-full max-w-xs">
          <button 
            onClick={handleNextClick}
            disabled={!accountName.trim()}
            className={`flex items-center justify-center px-5 py-2 rounded-[10px] shadow-[0px_2px_4px_-1px_rgba(12,12,106,0.5),0px_0px_0px_1px_#4470ff] ${
              accountName.trim() 
                ? 'bg-gradient-to-b from-[#48b3ff] to-[#0059ff]' 
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            <span className="font-semibold text-[16px] text-center text-white tracking-[-0.16px]">
              Next Step
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
