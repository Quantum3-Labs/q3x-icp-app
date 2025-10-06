"use client";

import InfoCardContainer from "./InfoCardContainer";
import React, { useEffect, useMemo, useState } from "react";
import TransactionRow from "./TransactionRow";
import { TransactionType } from "./TransactionRow";
import { MessageType, parseMessageQueue, PendingMessage } from "@/utils/messages";
import { stringToHex } from "@/utils/helper";
import { useSearchParams } from "next/navigation";
import { useWalletByCanisterId } from "@/hooks/api/useWallets";
import { useAuthStore, useCanisterStore, useWalletStore } from "@/store";

export interface WalletData {
  signers: string[];
  threshold: number;
  message_queue: any[];
  metadata: any[];
}

// Header Component
function Header() {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="text-[55.78px] font-semibold text-text-primary uppercase leading-none">
        <p>Dashboard</p>
      </div>
      <div className="bg-white rounded-xl w-[552px] relative">
        <div className="flex items-center gap-2 pl-1 pr-2 py-1 w-full">
          <div className="bg-surface-light p-2 rounded-lg shadow-[0px_0px_4px_0px_rgba(18,18,18,0.1)]">
            <img src="/misc/search-icon.svg" alt="search" className="w-4 h-4" />
          </div>
          <input
            type="text"
            className="flex-1 text-base text-text-secondary leading-none bg-transparent outline-none placeholder-text-secondary"
            placeholder="Enter address"
            aria-label="Enter address"
          />
          <div className="flex items-center justify-center gap-2 px-1.5 py-1.5 rounded-md shadow-[0px_0px_0px_1px_rgba(0,0,0,0.11),0px_1px_4.2px_-1px_rgba(0,0,0,0.25)] relative">
            <span className="text-[11px] font-medium text-text-secondary leading-none">
              <p>⌘ K</p>
            </span>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-0 border border-[#e0e0e0] rounded-xl pointer-events-none shadow-[0px_0px_10.3px_0px_rgba(135,151,255,0.14),0px_0px_89.5px_0px_rgba(0,0,0,0.05)]"
        />
      </div>
    </div>
  );
}

export default function DashboardContainer() {
  const searchParams = useSearchParams();
  const canisterIdFromUrl = searchParams.get("canisterid");
  const { identity, principal } = useAuthStore();
  const [walletData, setWalletData] = useState<WalletData[]>([]);
  const [pendingMessages, setPendingMessages] = useState<PendingMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const { actor, getWallet, approveMessage, checkCanSign, signMessage, setActor } = useCanisterStore();
  const { setCurrentWallet, currentWallet } = useWalletStore();

  const { data: wallet, isLoading } = useWalletByCanisterId(canisterIdFromUrl || "");

  // TODO: Find a better way to map message type to transaction type
  const getTransactionType = (messageType: MessageType): TransactionType => {
    switch (messageType) {
      case MessageType.ADD_SIGNER:
        return TransactionType.ADD_SIGNER;
      case MessageType.REMOVE_SIGNER:
        return TransactionType.REMOVE_SIGNER;
      case MessageType.SET_THRESHOLD:
        return TransactionType.THRESHOLD;
      case MessageType.TRANSFER:
        return TransactionType.SEND;
      default:
        return TransactionType.ADD_SIGNER;
    }
  };

  // TODO: find a better way to map message to transaction props
  const getTransactionProps = (message: PendingMessage) => {
    const baseProps = {
      type: getTransactionType(message.type),
      showButtons: message.needsApproval,
      showChevron: false, // TODO: have expanded content for certain types
      showExternalLink: !message.needsApproval,
      approveNumber: message.approveNumber,
      isApproved: Boolean(
        principal &&
          message.signers &&
          message.signers.length > 0 &&
          message.signers.map(s => s.toString()).includes(principal),
      ),
      oldThreshold: walletData[0].threshold,
      status: message.needsApproval ? undefined : ("success" as const),
      onApprove: () => handleApprove(message.rawMessage),
    };

    switch (message.type) {
      case MessageType.ADD_SIGNER:
        return {
          ...baseProps,
          signers: [message.data.substring(0, 10) + "..."], // Truncate principal for display
        };

      case MessageType.REMOVE_SIGNER:
        return {
          ...baseProps,
          signers: [message.data.substring(0, 10) + "..."],
        };

      case MessageType.SET_THRESHOLD:
        return {
          ...baseProps,
          newThreshold: message.data,
        };

      case MessageType.TRANSFER:
        // Parse transfer data: "amount::recipient" hoặc similar format
        const transferParts = message.data.split("::");
        return {
          ...baseProps,
          amount: transferParts[0] || "Transfer",
          to: transferParts[1]?.substring(0, 10) + "..." || "Unknown",
        };

      default:
        return baseProps;
    }
  };

  const handleApprove = async (messageId: string) => {
    try {
      setLoading(true);
      const messageHex = stringToHex(messageId);

      // Step 1: Approve the message
      await approveMessage(getWalletId, messageHex);

      // Step 2: Check if we can sign (threshold reached)
      const canSign = await checkCanSign(getWalletId, messageHex);

      if (canSign) {
        // Step 3: Auto sign if threshold is met
        await signMessage(getWalletId, messageHex);
      }

      // Step 4: Refresh wallet data to update UI
      setLoading(false);
      refreshWalletData();
    } catch (error) {
      console.log("Failed in approve flow:", error);
      alert(`Failed to approve: ${error}`);
      refreshWalletData();
    }
  };

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      const data = await getWallet(currentWallet?.name || "");
      if (data) {
        setWalletData(data);

        // Parse message queue
        const messages = parseMessageQueue(data[0]?.message_queue, data[0]?.threshold);
        setPendingMessages(messages);
        setLoading(false);
      }
    } catch (error) {
      console.log("Failed to fetch wallet:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshWalletData = async () => {
    await fetchWalletData();
  };

  useEffect(() => {
    if (wallet) {
      setCurrentWallet(wallet);
    }
    if (identity && canisterIdFromUrl) {
      setActor(canisterIdFromUrl || "");
    }
  }, [canisterIdFromUrl, wallet]);

  useEffect(() => {
    if (actor && currentWallet?.name) {
      fetchWalletData();
    }
  }, [currentWallet?.name, actor]);

  const getWalletId = useMemo(() => {
    return currentWallet?.name || "wallet-1";
  }, [currentWallet?.name]);

  if (isLoading) {
    return <span>Loading wallet...</span>;
  }

  return (
    <div className="flex flex-col gap-5 p-2">
      <div className="flex flex-row h-[100px] w-full justify-between">
        <div className="w-full relative">
          <img src="/misc/clock.svg" alt="clock" className="w-[150px]" />
          <div className="absolute -bottom-5 left-0 right-0 h-16 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
        </div>
        <InfoCardContainer
          walletData={walletData}
          walletName={currentWallet?.name}
          onUpdate={refreshWalletData}
          pendingTransaction={pendingMessages?.length}
          loading={loading}
        />
      </div>

      {/* header */}
      <Header />

      {/* body */}
      {loading ? (
        <span>Loading wallet data...</span>
      ) : (
        <div className="content-stretch flex flex-col gap-0.5 items-start justify-start relative size-full">
          {pendingMessages.length > 0 ? (
            pendingMessages.map(message => (
              <TransactionRow key={message.id} loading={loading} {...getTransactionProps(message)} />
            ))
          ) : (
            <div className="text-gray-500 text-center py-8">No pending transactions</div>
          )}
        </div>
      )}
    </div>
  );
}
