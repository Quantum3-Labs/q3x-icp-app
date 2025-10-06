import React from "react";
import { AccountCard } from "./AccountCard";
import { CustomCheckbox } from "../Common/CustomCheckbox";

interface SubAccountSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  offset: number;
}

export default function SubAccountSidebar({ isOpen, onClose, offset }: SubAccountSidebarProps) {
  return (
    <div
      className="absolute top-1 h-[99%] w-[280px] bg-background border z-10 border-primary rounded-lg  transition-all duration-300 ease-in-out"
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
            <h1 className="text-lg font-semibold  uppercase text-text-primary">Add sub account</h1>
            <span className="flex items-center gap-2 text-text-secondary">
              To <span className="text-text-primary">Account 1</span>{" "}
              <div className="w-fit px-2 rounded-full bg-primary text-white">
                <span className="text-white">0xB...37e</span>
              </div>
            </span>
          </header>

          <div className="flex items-center justify-center gap-2 rounded-lg bg-[#D6EDFF] p-2 text-primary">
            <img src="/misc/info-icon.svg" alt="Expand account" className="h-4 w-4" />
            <span className="text-primary leading-none text-sm">You can select multi kind of account to create</span>
          </div>

          <span className="text-text-secondary text-sm">Current supported chains</span>

          <div className="flex flex-col gap-4 items-start">
            <CustomCheckbox checked={true} onChange={() => {}} label="Arbitrum" icon="/token/arbitrum.svg" />
            <CustomCheckbox checked={true} onChange={() => {}} label="Ethereum" icon="/token/eth.svg" />
            <CustomCheckbox checked={true} onChange={() => {}} label="Bitcoin" icon="/token/btc.svg" />
          </div>

          <span className="text-text-secondary text-sm">Upcoming chain supported</span>

          <div className="flex flex-col gap-4 items-start">
            <CustomCheckbox checked={false} onChange={() => {}} label="Arbitrum" icon="/token/arbitrum.svg" disabled />
            <CustomCheckbox checked={false} onChange={() => {}} label="Ethereum" icon="/token/eth.svg" disabled />
            <CustomCheckbox checked={false} onChange={() => {}} label="Bitcoin" icon="/token/btc.svg" disabled />
          </div>
        </div>

        <div className="flex items-center justify-center bg-[#F7F7F7] w-full h-[50px] rounded-b-lg border-t border-divider">
          <button
            className="flex items-center justify-center gap-2 text-white px-4 py-2 rounded-lg w-[80%] leading-none cursor-pointer"
            style={{
              background: "linear-gradient(to bottom, #9C9C9C 0%, #303030 100%)",
            }}
          >
            <span className="text-white">Add accounts</span>
          </button>
        </div>
      </div>
    </div>
  );
}
