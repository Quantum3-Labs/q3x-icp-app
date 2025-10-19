import { copyAddressToClipboard, getShortenedAddress } from "@/utils/helper";
import React, { useState, useEffect } from "react";
import { Tooltip } from "react-tooltip";
import { ReceiveModal } from "../Modals/ReceiveModal";
import { ArrowRightLeft } from "lucide-react";

interface NetworkItemProps {
  icon: string;
  name: string;
  address: string;
  symbol: string;
  isDefault?: boolean;
  isActive?: boolean;
  onNetworkSelect?: (networkName: string) => void;
}

export function NetworkItem({
  icon,
  name,
  address,
  symbol,
  isDefault = false,
  isActive = false,
  onNetworkSelect,
}: NetworkItemProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [openReceiveModal, setOpenReceiveModal] = useState(false);

  const handleClick = () => {
    onNetworkSelect?.(name);
  };

  const handleThreeDotsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowTooltip(!showTooltip);
  };

  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowTooltip(false);
    if (showTooltip) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [showTooltip]);

  // Base classes that are always applied
  const baseContainerClasses =
    "flex gap-1.5 items-center px-2.5 py-1.5 w-full cursor-pointer hover:bg-gray-50 transition-colors";
  const baseBadgeClasses =
    "flex overflow-hidden gap-0.5 justify-center items-center self-stretch px-1.5 py-1.5 my-auto text-xs tracking-tight leading-tight text-white whitespace-nowrap rounded-[34px]";

  // Conditional classes
  const containerClasses = isActive
    ? `${baseContainerClasses} relative bg-blue-50 rounded-md border-l-5 border-l-primary`
    : `${baseContainerClasses} whitespace-nowrap rounded-xl`;

  const badgeClasses = isActive ? `${baseBadgeClasses} bg-primary` : `${baseBadgeClasses} bg-neutral-400`;

  return (
    <div className={containerClasses}>
      <img src={icon} alt={`${name} icon`} className=" w-6 " />
      <div className="flex-1 shrink self-stretch my-auto text-base tracking-tight leading-none basis-3 text-neutral-600">
        {name}
        {isDefault && <span className="text-primary"> [Default]</span>}
      </div>
      <div className={badgeClasses} onClick={() => copyAddressToClipboard(address)}>
        <span className="self-stretch my-auto text-white">{getShortenedAddress(address)}</span>
      </div>
      <div className="relative">
        <img
          src="/misc/three-dots.svg"
          alt="More options"
          className="object-contain shrink-0 self-stretch my-auto w-5 aspect-square cursor-pointer"
          data-tooltip-id={`network-tooltip-${name}`}
          onClick={() => setShowTooltip(true)}
        />
        <Tooltip
          id={`network-tooltip-${name}`}
          isOpen={showTooltip}
          place="right"
          openOnClick={true}
          border="1px solid #0059ff"
          className="!bg-white !border !border-primary !rounded-lg !shadow-lg !p-0 !w-[200px]"
          clickable={true}
          opacity={1}
          render={({ content, activeAnchor }) => (
            <>
              <div className="flex flex-col gap-1 w-full justify-center p-1">
                <div className="flex items-center gap-2 hover:bg-[#F1F1F1] rounded-md p-1.5 w-full" onClick={() => setOpenReceiveModal(true)}>
                  <img src="/account/fund-account.svg" alt="Fund account" className="w-5 h-5" />
                  <span className=" text-gray-700">Fund Account</span>
                </div>
                <div
                  onClick={handleClick}
                  className="flex items-center gap-2 hover:bg-[#F1F1F1] rounded-md p-1.5 w-full"
                >
                  <ArrowRightLeft className="w-5 h-5 text-gray-700" />
                  <span className=" text-gray-700">Switch to chain</span>
                </div>
              </div>
              {/* <div className="border-t border-divider p-1">
                <div className="flex items-center gap-2  rounded-md p-1.5 w-full bg-[#FFF1F1]">
                  <img src="/misc/red-trashcan-icon.svg" alt="Remove account" className="w-5 h-5" />
                  <span className=" text-gray-700">Remove account</span>
                </div>
              </div> */}
            </>
          )}
        />
      </div>
      <ReceiveModal address={address} symbol={symbol?.toLowerCase()} open={openReceiveModal} onOpenChange={setOpenReceiveModal}><></></ReceiveModal>
    </div>
  );
}
