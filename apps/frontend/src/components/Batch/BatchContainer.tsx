"use client";
import React, { useState } from "react";
import { CustomCheckbox } from "../Common/CustomCheckbox";
import TransactionSummary from "./TransactionSummary";
import { Transaction } from "@q3x/models";
import { useAuthStore, useCanisterStore, useWalletStore } from "@/store";
import {
  useBatchDeleteTransactions,
  useBulkUpdateTransactionStatus,
  useDraftTransactions,
} from "@/hooks/api/useTransaction";
import { TransactionType } from "@q3x/prisma";
import { Principal } from "@dfinity/principal";
import { toast } from "sonner";

// Helper function to format transaction display
const formatTransaction = (transaction: Transaction) => {
  if (transaction.type === TransactionType.ICP_TRANSFER) {
    const data = transaction.data;
    const amountICP = (parseInt(data.amount) / 100_000_000).toFixed(8);
    return {
      type: "Send",
      amount: `${amountICP} ICP`,
      recipient: data.to_principal,
    };
  } else if (transaction.type === TransactionType.EVM_TRANSFER) {
    const data = transaction.data;
    const amountETH = (parseInt(data.value) / 1e18).toFixed(6);
    return {
      type: "Send",
      amount: `${amountETH} ETH`,
      recipient: data.to,
    };
  }
  return {
    type: "Unknown",
    amount: "0",
    recipient: "Unknown",
  };
};

// Header Component
function Header({ transactionCount }: { transactionCount: number }) {
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex gap-[5px] items-center justify-start w-full">
        <div className="text-[#545454] text-6xl text-center font-bold uppercase">your</div>
        <div className="h-[50px] relative rounded-full w-[100px] border-[6px] border-[#FF2323] border-solid flex items-center justify-center">
          <span className="text-[#FF2323] text-4xl text-center font-extrabold uppercase leading-none">
            {transactionCount ?? 0}
          </span>
        </div>
        <div className="text-[#545454] text-6xl text-center font-bold uppercase">batch</div>
      </div>
      <div className="flex flex-col leading-none gap-1">
        <span className="text-text-secondary text-[16px] ">
          Making bulk transactions will save you time as well as transaction costs.
        </span>
        <span className="text-text-secondary text-[16px] ">
          Below is a list of transactions that have been recently added.
        </span>
      </div>
    </div>
  );
}

// Batch Transactions Component
function BatchTransactions({
  transactions,
  selectedItems,
  selectAll,
  activeTransaction,
  onSelectAll,
  onSelectItem,
  onTransactionClick,
  onRemove,
  onEdit,
  isLoading,
}: {
  transactions: Transaction[];
  selectedItems: Set<string>;
  selectAll: boolean;
  activeTransaction: string | null;
  onSelectAll: () => void;
  onSelectItem: (id: string) => void;
  onTransactionClick: (id: string) => void;
  onRemove: (id: string) => void;
  onEdit: (id: string) => void;
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-text-secondary">Loading transactions...</div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 gap-2">
        <div className="text-text-secondary text-lg">No draft transactions</div>
        <div className="text-text-secondary text-sm">Add transactions from the Send page to get started</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 w-full">
      {/* Select All Button */}
      <div className="bg-[#0059ff] flex gap-[9.342px] items-center justify-start px-4 py-[9px] rounded-full cursor-pointer w-fit">
        <button onClick={onSelectAll} className="font-medium text-[14px] text-white tracking-[-0.42px]">
          Select all
        </button>
      </div>

      {/* Transactions Grid */}
      <div className="grid grid-cols-1 gap-0.5 w-full">
        {transactions.map(transaction => {
          const formatted = formatTransaction(transaction);
          return (
            <div
              key={transaction.id}
              className={`grid grid-cols-[auto_auto_auto_auto_1fr_auto_auto] gap-[7px] items-center p-[10px] w-full cursor-pointer ${
                activeTransaction === transaction.id ? "bg-[#066eff]" : "bg-[#f7f7f7]"
              }`}
              onClick={() => onTransactionClick(transaction.id)}
            >
              {/* Checkbox */}
              <div className="flex items-center justify-center" onClick={e => e.stopPropagation()}>
                <CustomCheckbox
                  checked={selectedItems.has(transaction.id)}
                  onChange={() => onSelectItem(transaction.id)}
                />
              </div>

              {/* Transaction Type */}
              <div
                className={`w-[50px] text-[16px] tracking-[-0.32px] ${
                  activeTransaction === transaction.id ? "text-white" : "text-[#363636]"
                }`}
              >
                {formatted.type}
              </div>

              {/* Amount */}
              <div
                className={`w-[170px] text-[16px] tracking-[-0.32px] ${
                  activeTransaction === transaction.id ? "text-white" : "text-[#363636]"
                }`}
              >
                {formatted.amount}
              </div>

              {/* Arrow */}
              <div className="flex items-center justify-center w-16">
                <img
                  src="/arrow/thin-long-arrow-right.svg"
                  alt="arrow"
                  className="w-full h-full"
                  style={activeTransaction === transaction.id ? { filter: "invert(1) brightness(1000%)" } : {}}
                />
              </div>

              {/* Recipient */}
              <div
                className={`text-[16px] tracking-[-0.32px] ${
                  activeTransaction === transaction.id ? "text-white" : "text-[#363636]"
                }`}
              >
                To: [{formatted.recipient}]
              </div>

              {/* Edit Button */}
              {/* <div className="flex items-center justify-center" onClick={e => e.stopPropagation()}>
                <img
                  src="/misc/edit-icon.svg"
                  alt="edit"
                  className="w-6 h-6 opacity-50 cursor-not-allowed"
                  style={activeTransaction === transaction.id ? { filter: "invert(1) brightness(1000%)" } : {}}
                />
              </div> */}

              {/* Remove Button */}
              <div className="flex items-center justify-center" onClick={e => e.stopPropagation()}>
                <button
                  onClick={() => onRemove(transaction.id)}
                  className="bg-gradient-to-b from-[#ff2323] to-[#ed1515] flex items-center justify-center px-5 py-1.5 rounded-[10px] shadow-[0px_2px_4px_-1px_rgba(255,0,4,0.5),0px_0px_0px_1px_#ff6668] cursor-pointer"
                >
                  <span className="font-medium text-[14px] text-center text-white tracking-[-0.42px]">Remove</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function BatchContainer() {
  const { currentWallet } = useWalletStore();
  const { principal } = useAuthStore();
  const { proposeBatchTransaction } = useCanisterStore();
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [activeTransaction, setActiveTransaction] = useState<string | null>(null);
  const [isExiting, setIsExiting] = useState(false);
  const [loading, setLoading] = useState(false);

  const { mutateAsync: batchDeleteTransactions } = useBatchDeleteTransactions();

  // API hooks
  const { data: transactions = [], isLoading } = useDraftTransactions(currentWallet?.canisterId || "");
  const bulkUpdateStatus = useBulkUpdateTransactionStatus();

  const convertToRustTransaction = (transaction: Transaction) => {
    if (transaction.type === TransactionType.ICP_TRANSFER) {
      const data = transaction.data as {
        amount: string;
        to_principal: string;
        to_subaccount?: [];
        memo?: [];
      };

      return {
        IcpTransfer: {
          amount: parseInt(data.amount),
          to_principal: Principal.fromText(data.to_principal),
          to_subaccount: data.to_subaccount ? data.to_subaccount : [],
          memo: data.memo ? data.memo : [],
        },
      };
    } else if (transaction.type === TransactionType.EVM_TRANSFER) {
      const data = transaction.data as {
        value: string;
        to: string;
        chain_id: string;
        gas_price: string;
        gas_limit: number;
      };

      return {
        EvmTransfer: {
          to: data.to,
          value: parseInt(data.value),
          chain_id: parseInt(data.chain_id),
          gas_price: parseInt(data.gas_price),
          gas_limit: data.gas_limit,
        },
      };
    }

    throw new Error(`Unsupported transaction type: ${transaction.type}`);
  };

  const buildBatchData = (transactions: Transaction[], createdBy = "unknown") => {
    return {
      id: `batch_${Date.now()}`,
      description: `Batch of ${transactions.length} transactions`,
      created_at: Math.floor(Date.now() / 1000), // Unix timestamp
      created_by: createdBy ? Principal.fromText(createdBy) : "unknown",
      transactions: transactions.map(tx => convertToRustTransaction(tx)),
    };
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems(new Set());
      setSelectAll(false);
    } else {
      setSelectedItems(new Set(transactions.map(t => t.id)));
      setSelectAll(true);
    }
  };

  const handleSelectItem = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
    setSelectAll(newSelected.size === transactions.length);
  };

  const handleTransactionClick = (id: string) => {
    if (activeTransaction === id) {
      setIsExiting(true);
      setTimeout(() => {
        setActiveTransaction(null);
        setIsExiting(false);
      }, 300);
    } else {
      setActiveTransaction(id);
    }
  };

  const handleRemove = async (id: string) => {
    try {
      await batchDeleteTransactions([id]);
      toast.success("Transaction removed successfully");
      if (activeTransaction === id) {
        setIsExiting(true);
        setTimeout(() => {
          setActiveTransaction(null);
          setIsExiting(false);
        }, 300);
      }
    } catch (error) {
      console.error("Failed to remove transaction:", error);
    }
  };

  const handleEdit = (id: string) => {
    console.log("Edit transaction:", id);
    // TODO: Implement edit functionality
  };

  const handleExecuteBatch = async () => {
    setLoading(true);
    if (selectedItems.size === 0 || !currentWallet?.name) {
      console.error("No transactions selected or wallet not found");
      return;
    }

    try {
      // Build batch data
      const selectedTransactions = transactions.filter(tx => selectedItems.has(tx.id));
      const batchData = buildBatchData(selectedTransactions, principal ?? "unknown");

      // Propose batch to canister
      const result = await proposeBatchTransaction(currentWallet.name, batchData);

      console.log("✅ Batch proposed successfully:", result);

      await bulkUpdateStatus.mutateAsync({
        transactionIds: Array.from(selectedItems),
        status: "PROPOSED",
        canisterId: currentWallet.canisterId,
      });

      // Reset selection
      setSelectedItems(new Set());
      setSelectAll(false);

      toast.success("Batch proposed successfully!");
    } catch (error) {
      console.error("❌ Failed to execute batch:", error);
      toast.error("Failed to execute batch");
    } finally {
      setLoading(false);
    }
  };

  // Don't render if no wallet selected
  if (!currentWallet?.name) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="text-text-secondary">Please select a wallet</div>
      </div>
    );
  }

  return (
    <div className="flex flex-row gap-1 w-full h-full bg-app-background">
      <div className="flex flex-col gap-5 p-3 bg-background rounded-lg flex-1 border border-divider">
        <div className="flex flex-row h-[100px] w-full justify-between">
          <div className="w-full relative">
            <img src="/misc/shopping-bag.svg" alt="clock" className="w-[150px]" />
            <div className="absolute -bottom-5 left-0 right-0 h-30 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
          </div>
        </div>

        <Header transactionCount={transactions.length} />

        <BatchTransactions
          transactions={transactions}
          selectedItems={selectedItems}
          selectAll={selectAll}
          activeTransaction={activeTransaction}
          onSelectAll={handleSelectAll}
          onSelectItem={handleSelectItem}
          onTransactionClick={handleTransactionClick}
          onRemove={handleRemove}
          onEdit={handleEdit}
          isLoading={isLoading}
        />
      </div>

      {selectedItems.size > 0 && (
        <div className={`overflow-hidden ${isExiting ? "animate-slide-out" : "animate-slide-in"}`}>
          <TransactionSummary
            className="w-[400px]"
            transactions={transactions
              .filter(tx => selectedItems.has(tx.id))
              .map(tx => {
                const formatted = formatTransaction(tx);
                return {
                  amount: formatted.amount,
                  type: "send" as const,
                  recipient: formatted.recipient,
                  id: tx.id,
                };
              })}
            onConfirm={handleExecuteBatch}
            isLoading={loading}
          />
        </div>
      )}
    </div>
  );
}
