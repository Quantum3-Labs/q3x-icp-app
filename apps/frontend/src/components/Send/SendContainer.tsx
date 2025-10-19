"use client";

import React, { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";
import SelectTokenTooltip from "../Common/SelectTokenTooltip";
import SelectAddressTooltip from "../Common/SelectAddressTooltip";
import { useAuthStore, useCanisterStore, useWalletStore } from "@/store";
import { useCreateTransaction } from "@/hooks/api/useTransaction";
import { TransactionType } from "@q3x/prisma";
import { toast } from "sonner";
import { Token } from "@q3x/models";

export default function SendContainer() {
  const { currentWallet, activeChainId } = useWalletStore();
  const { transfer, transferEvm } = useCanisterStore();
  const { principal } = useAuthStore();

  const [showTokenTooltip, setShowTokenTooltip] = useState(false);
  const [showAddressTooltip, setShowAddressTooltip] = useState(false);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<{
    id: string;
    name: string;
    company: string;
    address: string;
    icon: string;
  } | null>(null);

  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const createTransaction = useCreateTransaction();

  const handleTokenSelect = (token: Token) => {
    setSelectedToken(token);
    setShowTokenTooltip(false);
  };

  const handleAddressSelect = (address: any) => {
    setSelectedAddress(address);
    setAddress(address.address);
    setShowAddressTooltip(false);
  };

  const handleSendNow = async () => {
    if (!currentWallet?.name || !amount || !address) {
      console.error("Missing required fields");
      return;
    }

    setIsLoading(true);

    try {
      if (selectedToken?.id === "icp") {
        // ICP Transfer
        console.log("💎 Processing ICP transfer");
        const amountInE8s = BigInt(Math.floor(parseFloat(amount) * 100_000_000));

        const result = await transfer(currentWallet.name, amountInE8s, address);
        console.log("✅ ICP transfer successful:", result);
      } else {
        // EVM Transfer
        // 1. Prepare transfer args
        const amountInWei = BigInt(Math.floor(parseFloat(amount) * 1e18));
        const transferArgs = {
          wallet_id: currentWallet.name,
          to: address,
          value: amountInWei,
          chain_id: BigInt(selectedToken?.chainId ?? "0"),
          gas_price: BigInt(20000000000), // 20 gwei
          gas_limit: BigInt(21000),
        };

        console.log("⚡ EVM transfer args:", transferArgs);

        // 3. Execute transfer
        const result = await transferEvm(transferArgs);
        console.log("✅ EVM transfer successful:", result);
      }

      // Reset form on success
      setAmount("");
      setAddress("");
      setSelectedAddress(null);
      toast.success("Create transfer message successful! Please wait for confirmation.");
    } catch (error) {
      console.error("❌ Transfer failed:", error);
      toast.error("Transfer failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddBatch = async () => {
    if (!currentWallet?.name || !amount || !address) {
      console.error("Missing required fields for batch");
      return;
    }

    try {
      let transactionData;
      let transactionType;

      if (selectedToken?.id === "icp") {
        // ICP Transfer data
        const amountInE8s = Math.floor(parseFloat(amount) * 100_000_000).toString();
        transactionData = {
          amount: amountInE8s,
          to_principal: address,
          to_subaccount: null,
          memo: null,
        };
        transactionType = TransactionType.ICP_TRANSFER;
      } else {
        // EVM Transfer data
        const amountInWei = Math.floor(parseFloat(amount) * 1e18).toString();
        transactionData = {
          to: address,
          value: amountInWei,
          chain_id: selectedToken?.chainId,
          gas_price: "20000000000", // 20 gwei
          gas_limit: 21000,
        };
        transactionType = TransactionType.EVM_TRANSFER;
      }

      // Create transaction with DRAFT status
      await createTransaction.mutateAsync({
        walletId: currentWallet.name,
        type: transactionType,
        data: transactionData,
        description: `${selectedToken?.symbol} transfer: ${amount} to ${address}`,
        createdBy: principal ?? "",
      });

      // Reset form on success
      setAmount("");
      setAddress("");
      setSelectedAddress(null);

      toast.success("Transaction added to batch successfully! Please review your batch");
    } catch (error) {
      console.error("❌ Failed to add to batch:", error);
      toast.error("Failed to add transaction to batch");
    }
  };

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

  useEffect(() => {
    setSelectedToken(null);
  }, [activeChainId]);

  return (
    <div className="overflow-hidden relative w-full h-full flex flex-col rounded-lg">
      {/* Background images */}
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
            <img src="/arrow/caret-down.svg" alt="Select token" className="w-5 h-5" />
            <img src={selectedToken?.icon ?? "/misc/coin-icon.gif"} alt={selectedToken?.name} className="w-9 h-9" />
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
            style={{ zIndex: 10 }}
            noArrow={true}
            offset={340}
            render={() => (
              <SelectTokenTooltip onTokenSelect={handleTokenSelect} onClose={() => setShowTokenTooltip(false)} />
            )}
          />

          {/* Amount input */}
          <input
            type="text"
            value={amount}
            placeholder="0.00"
            onChange={e => setAmount(e.target.value)}
            className="text-text-primary text-[44px] uppercase outline-none w-[90px]"
            disabled={isLoading}
          />
        </div>

        {/* Visual divider */}
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
                  selectedToken?.id !== "icp" && amount.trim() !== "" ? "border-[#0059ff]" : "border-[#c8c8c8]"
                }`}
              ></div>
              {/* Arrow indicators */}
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
                disabled={isLoading}
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
          <button
            onClick={handleAddBatch}
            className="bg-gradient-to-b from-[#e6a7ff] to-[#c43ef7] flex items-center justify-center px-5 py-2 rounded-[10px] shadow-[0px_2px_4px_-1px_rgba(231,113,255,0.5),0px_0px_0px_1px_#ed66ff] flex-1 disabled:opacity-50"
            disabled={isLoading || !amount || !address || !selectedToken}
          >
            <span className="font-semibold text-[16px] text-center text-white tracking-[-0.16px]">
              {" "}
              {createTransaction.isPending ? "Adding..." : "Add to batch"}
            </span>
          </button>
          <button
            onClick={handleSendNow}
            disabled={isLoading || !amount || !address || !selectedToken}
            className="bg-gradient-to-b from-[#48b3ff] to-[#0059ff] flex items-center justify-center px-5 py-2 rounded-[10px] shadow-[0px_2px_4px_-1px_rgba(12,12,106,0.5),0px_0px_0px_1px_#4470ff] flex-1 disabled:opacity-50"
          >
            <span className="font-semibold text-[16px] text-center text-white tracking-[-0.16px]">
              {isLoading ? "Sending..." : "Send now"}
            </span>
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
          style={{ zIndex: 10 }}
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
