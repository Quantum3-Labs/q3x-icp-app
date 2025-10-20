"use client";

import InfoCardContainer from "./InfoCardContainer";
import React, { useEffect, useMemo, useState } from "react";
import TransactionRow from "./TransactionRow";
import { MessageType, parseMessageQueue, PendingMessage } from "@/utils/messages";
import { stringToHex } from "@/utils/helper";
import { useAuthStore, useCanisterStore, useWalletStore } from "@/store";
import { Skeleton } from "../ui/skeleton";
import { useTransactionHistory } from "@/hooks/api/useTransactionHistory";
import { useAddSigner, useRemoveSigner } from "@/hooks/api/useWallets";
import Image from "next/image";

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
      {/* <div className="bg-white rounded-xl w-[552px] relative">
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
      </div> */}
    </div>
  );
}

export default function DashboardContainer() {
  const { identity, principal } = useAuthStore();
  const [walletData, setWalletData] = useState<WalletData[]>([]);
  const [pendingMessages, setPendingMessages] = useState<PendingMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const { actor, getWallet, approveMessage, checkCanSign, signMessage, setActor, getEvmAddress } = useCanisterStore();
  const { currentWallet } = useWalletStore();

  const { mutateAsync: addSigner } = useAddSigner();
  const { mutateAsync: removeSigner } = useRemoveSigner();

  const { history, loading: historyLoading, saveTransaction } = useTransactionHistory(currentWallet?.name || "");

  const extractAmount = (message: any): string => {
    switch (message.type) {
      case MessageType.TRANSFER:
        return message.data.split("::")[0] || "0";
      case MessageType.TRANSFER_EVM:
        return message.data.split("::")[1] || "0";
      case MessageType.BATCH:
        return "Batch";
      default:
        return "0";
    }
  };

  const extractRecipient = (message: any): string => {
    switch (message.type) {
      case MessageType.TRANSFER:
        return message.data.split("::")[1] || "Unknown";
      case MessageType.TRANSFER_EVM:
        return message.data.split("::")[0] || "Unknown";
      case MessageType.ADD_SIGNER:
      case MessageType.REMOVE_SIGNER:
        return message.data;
      case MessageType.BATCH:
        return "Multiple";
      default:
        return "N/A";
    }
  };

  const allTransactions = useMemo(() => {
    // Convert pending messages to display format
    const pendingTxs = pendingMessages.map(msg => ({
      ...msg,
      isPending: true,
      createdAt: new Date().toISOString(),
      id: `pending_${msg.id}`,
    }));

    // Convert history to display format
    const historyTxs = history.map(tx => ({
      id: tx.id,
      type: tx.type as MessageType,
      data: tx.data,
      status: tx.status,
      isPending: false,
      createdAt: tx.createdAt,
      rawMessage: tx.id,
      needsApproval: false,
      approveNumber: tx.approveNumber || 0,
      signers: tx.signers || [],
      batchData: tx.type === "BATCH" ? tx.data : undefined,
      txHash: tx.txHash,
      isHistory: true,
    }));

    // Combine and sort by date
    return [...pendingTxs, ...historyTxs]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 50);
  }, [pendingMessages, history]);

  // TODO: find a better way to map message to transaction props
  const getTransactionProps = (message: PendingMessage) => {
    const baseProps = {
      type: message.type,
      isHistory: (message as any)?.isHistory,
      showButtons: message.needsApproval,
      showExternalLink: !message.needsApproval,
      approveNumber: message.approveNumber,
      approvedSigners: message.signers,
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
          signers: [message.data],
        };

      case MessageType.REMOVE_SIGNER:
        return {
          ...baseProps,
          signers: [message.data],
        };

      case MessageType.SET_THRESHOLD:
        return {
          ...baseProps,
          newThreshold: message.data,
        };

      case MessageType.TRANSFER:
        // Parse transfer data: "amount::recipient"
        const transferParts = message.data.split("::");
        return {
          ...baseProps,
          amount: transferParts[0] || "Transfer",
          to: transferParts[1] || "Unknown",
        };

      case MessageType.TRANSFER_EVM:
        // Parse EVM transfer data: "to::value::chain_id::gas_price::gas_limit"
        const evmTransferParts = message.data.split("::");

        if (evmTransferParts.length >= 5) {
          const to = evmTransferParts[0];
          const value = evmTransferParts[1];

          return {
            ...baseProps,
            amount: value,
            to,
          };
        }

      case MessageType.BATCH:
        return {
          ...baseProps,
          batchData: message.batchData,
        };

      default:
        return baseProps;
    }
  };

  const handleApprove = async (messageId: string) => {
    try {
      setLoading(true);
      const messageHex = stringToHex(messageId);

      const message = pendingMessages.find(m => m.rawMessage === messageId);

      // Step 1: Approve the message
      await approveMessage(getWalletId, messageHex);

      // Step 2: Check if we can sign (threshold reached)
      const canSign = await checkCanSign(getWalletId, messageHex);

      if (canSign) {
        // Step 3: Auto sign if threshold is met
        await signMessage(getWalletId, messageHex);

        if (message && currentWallet?.name) {
          saveTransaction({
            type: message.type,
            data: message.data,
            status: "success",
            amount: extractAmount(message),
            recipient: extractRecipient(message),
            approveNumber: message.approveNumber,
            signers: message.signers?.map(s => s.toString()) || [],
          });

          //add or remove on backend
          if (message.type === MessageType.ADD_SIGNER) {
            await addSigner({
              walletId: currentWallet.name,
              principal: message.data,
            });
          } else if (message.type === MessageType.REMOVE_SIGNER) {
            await removeSigner({
              walletId: currentWallet.name,
              principal: message.data,
            });
          }
        }
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
    if (actor && currentWallet?.name) {
      fetchWalletData();
    }
  }, [currentWallet?.name, actor]);

  const getWalletId = useMemo(() => {
    return currentWallet?.name || "wallet-1";
  }, [currentWallet?.name]);

  const emptyTransactionComponent = (
    <div className={`w-full flex flex-col items-center justify-center py-16 px-4 relative`}>
      <div className="flex flex-row gap-3 items-center mb-8">
        <div className="w-[115px] h-[150px] bg-gray-50 rounded-2xl flex items-center justify-center">
          <span className="w-[20px] h-[20px] block bg-gradient-to-b from-[#363636] to-[#F8F8F8] opacity-30 rounded-4xl"></span>
        </div>
        <div className="w-[115px] h-[150px] bg-gray-50 rounded-2xl flex items-center justify-center">
          <span className="w-[20px] h-[20px] block bg-gradient-to-b from-[#363636] to-[#F8F8F8] opacity-10 rounded-4xl"></span>
        </div>
        <div className="relative w-[155px] h-[185px] z-10 rounded-2xl from-[#FFFFFF] to-[#6AA8FF] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-100 to-blue-200 rounded-2xl shadow-lg">
            <div className="flex items-center justify-center w-full h-full">
              <Image
                src="/common/empty-avatar.svg"
                alt="No transactions found"
                width={119}
                height={177}
                className="object-contain grayscale-100"
              />
            </div>
          </div>
        </div>
        <div className="w-[115px] h-[150px] bg-gray-50 rounded-2xl flex items-center justify-center">
          <span className="w-[20px] h-[20px] block bg-gradient-to-b from-[#363636] to-[#F8F8F8] opacity-10 rounded-4xl"></span>
        </div>
        <div className="w-[115px] h-[150px] bg-gray-50 rounded-2xl flex items-center justify-center">
          <span className="w-[20px] h-[20px] block bg-gradient-to-b from-[#363636] to-[#F8F8F8] opacity-30 rounded-4xl"></span>
        </div>
      </div>

      {/* Text Content */}
      <div className="text-center space-y-2 max-w-md z-10 relative">
        <h3 className="text-xl font-bold text-blue-600 tracking-wide">NO TRANSACTION FOUND</h3>
        <p className="text-sm text-gray-500 leading-relaxed">There is no transaction found in your account</p>
      </div>
    </div>
  );

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
      {loading || historyLoading ? (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      ) : (
        <div className="content-stretch flex flex-col gap-0.5 items-start justify-start relative size-full">
          {allTransactions.length > 0 ? (
            allTransactions.map(message => (
              <TransactionRow key={message.id} keyTx={message.id} loading={loading} {...getTransactionProps(message)} />
            ))
          ) : (
            <> {currentWallet?.name && emptyTransactionComponent} </>
          )}
        </div>
      )}
    </div>
  );
}
