"use client";

import React, { useState } from "react";

interface Address {
  id: string;
  name: string;
  company: string;
  address: string;
  icon: string;
  isSelected?: boolean;
}

interface SelectAddressTooltipProps {
  onAddressSelect?: (address: Address) => void;
  onClose?: () => void;
}

export default function SelectAddressTooltip({ onAddressSelect, onClose }: SelectAddressTooltipProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");

  const addresses: Address[] = [
    {
      id: "1",
      name: "John Doe",
      company: "Google",
      address: "0xd3...ah7f",
      icon: "/misc/default-address-avatar.svg",
    },
    {
      id: "2",
      name: "Jane Smith",
      company: "Apple",
      address: "0x123...4567",
      icon: "/misc/default-address-avatar.svg",
    },
    {
      id: "3",
      name: "Alice Johnson",
      company: "Microsoft",
      address: "0x123...4567",
      icon: "/misc/default-address-avatar.svg",
    },
    {
      id: "4",
      name: "Bob Brown",
      company: "Amazon",
      address: "0x123...4567",
      icon: "/misc/default-address-avatar.svg",
    },
    {
      id: "5",
      name: "Charlie Davis",
      company: "Facebook",
      address: "0x123...4567",
      icon: "/misc/default-address-avatar.svg",
    },
  ];

  const companies = ["All", "Google", "Apple", "Microsoft", "Amazon", "Facebook"];

  const filteredAddresses = addresses.filter(
    address =>
      (selectedFilter === "All" || address.company === selectedFilter) &&
      (address.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        address.company.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  const handleAddressSelect = (address: Address) => {
    onAddressSelect?.(address);
    onClose?.();
  };

  return (
    <div className="contents relative w-full h-full">
      {/* Main tooltip container */}
      <div className="absolute bg-white rounded-[16px] w-[315px] h-[345px] shadow-[0px_0px_35.2px_0px_rgba(0,0,0,0.06)] border border-primary overflow-hidden overflow-y-auto">
        <div className="flex flex-col items-start justify-start w-full">
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
                    placeholder="Enter address name"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="text-[#adadad] text-[16px] outline-none placeholder:text-[#adadad] bg-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-1 items-center overflow-x-auto px-4 pb-2">
            {companies.map(company => (
              <button
                key={company}
                onClick={() => setSelectedFilter(company)}
                className={`px-4 py-1 rounded-[20px] text-sm font-medium cursor-pointer whitespace-nowrap ${
                  selectedFilter === company ? "bg-primary text-white" : "bg-[#e0e0e0] text-[#676767]"
                }`}
              >
                {company}
              </button>
            ))}
          </div>

          {/* Company section */}

          {/* Token list section */}
          <div className="flex flex-col gap-2.5 h-full items-start justify-start w-full">
            {/* Header */}
            <div className="flex gap-0.5 items-center justify-center px-2.5 py-0 w-full">
              <div className="grow text-[#363636] text-[15px]">
                <span>Your contacts (3)</span>
              </div>
            </div>

            {/* Token list */}
            <div className="flex flex-col w-full overflow-y-auto h-full">
              {filteredAddresses.map(address => (
                <div
                  key={address.id}
                  onClick={() => handleAddressSelect(address)}
                  className={`flex gap-[7px] items-center justify-start py-1 px-3 w-full cursor-pointer hover:bg-gray-50 transition-colors ${
                    address.isSelected ? "bg-[#edf8ff]" : "bg-white"
                  }`}
                >
                  {/* Token icon */}
                  <div className="w-8 h-8">
                    <img src={address.icon} alt={address.name} className="w-full h-full" />
                  </div>

                  {/* Token info */}
                  <div className="flex flex-col grow items-start justify-center">
                    <div className="font-medium text-[#363636] text-[14px] w-full">{address.name}</div>
                    <div className="text-[#676767] text-[12px] w-full">{address.company}</div>
                  </div>

                  {/* Balance info */}
                  <div className="flex flex-col grow items-end justify-center text-right">
                    <div className="font-medium text-[#363636] text-[14px] w-full">
                      <span>
                        [<span className="text-primary">{address.address}</span>]
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Arrow pointer */}
      <div className={`absolute flex items-center justify-center w-[15px] top-43 left-[318px]`}>
        <img src="/arrow/filled-triangle-right.svg" alt="Filled triangle right" className="w-full h-full" />
      </div>
    </div>
  );
}
