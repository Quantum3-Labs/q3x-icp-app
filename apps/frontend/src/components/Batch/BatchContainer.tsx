"use client";
import React, { useState } from "react";
import { CustomCheckbox } from "../Common/CustomCheckbox";
import TransactionSummary from "./TransactionSummary";

// Header Component
function Header() {
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex gap-[5px] items-center justify-start w-full">
        <div className="text-[#545454] text-6xl text-center font-bold uppercase">your</div>
        <div className="h-[50px] relative rounded-full w-[100px] border-[6px] border-[#FF2323] border-solid flex items-center justify-center">
          <span className="text-[#FF2323] text-4xl text-center font-extrabold uppercase leading-none">04</span>
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
}: {
  transactions: { id: string; type: string; amount: string; recipient: string }[];
  selectedItems: Set<string>;
  selectAll: boolean;
  activeTransaction: string | null;
  onSelectAll: () => void;
  onSelectItem: (id: string) => void;
  onTransactionClick: (id: string) => void;
  onRemove: (id: string) => void;
  onEdit: (id: string) => void;
}) {
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
        {transactions.map(transaction => (
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
              {transaction.type}
            </div>

            {/* Amount */}
            <div
              className={`w-[170px] text-[16px] tracking-[-0.32px] ${
                activeTransaction === transaction.id ? "text-white" : "text-[#363636]"
              }`}
            >
              {transaction.amount}
            </div>

            {/* Arrow */}
            <div className="flex items-center justify-center w-16 ">
              {transaction.type === "Send" ? (
                <img
                  src="/arrow/thin-long-arrow-right.svg"
                  alt="arrow"
                  className="w-full h-full"
                  style={activeTransaction === transaction.id ? { filter: "invert(1) brightness(1000%)" } : {}}
                />
              ) : (
                <img
                  src="/arrow/thin-long-arrow-left-right.svg"
                  alt="arrow"
                  className="w-full h-full"
                  style={activeTransaction === transaction.id ? { filter: "invert(1) brightness(1000%)" } : {}}
                />
              )}
            </div>

            {/* Recipient */}
            <div
              className={`text-[16px] tracking-[-0.32px] ${
                activeTransaction === transaction.id ? "text-white" : "text-[#363636]"
              }`}
            >
              To: {transaction.recipient.includes("BTC") ? transaction.recipient : `[${transaction.recipient}]`}
            </div>

            {/* Edit Button */}
            <div className="flex items-center justify-center" onClick={e => e.stopPropagation()}>
              <img
                src="/misc/edit-icon.svg"
                alt="edit"
                className="w-6 h-6"
                style={activeTransaction === transaction.id ? { filter: "invert(1) brightness(1000%)" } : {}}
              />
            </div>

            {/* Remove Button */}
            <div className="flex items-center justify-center" onClick={e => e.stopPropagation()}>
              <button
                onClick={() => onRemove(transaction.id)}
                className="bg-gradient-to-b from-[#ff2323] to-[#ed1515] flex items-center justify-center px-5 py-1.5 rounded-[10px] shadow-[0px_2px_4px_-1px_rgba(255,0,4,0.5),0px_0px_0px_1px_#ff6668]"
              >
                <span className="font-medium text-[14px] text-center text-white tracking-[-0.42px]">Remove</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function BatchContainer() {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [activeTransaction, setActiveTransaction] = useState<string | null>(null);
  const [isExiting, setIsExiting] = useState(false);

  const transactions = [
    {
      id: "1",
      type: "Send",
      amount: "$1,000,000,000 USDT",
      recipient: "Tim Cook",
    },
    {
      id: "2",
      type: "Swap",
      amount: "$1,000,000,000 USDT",
      recipient: "10 BTC",
    },
    {
      id: "3",
      type: "Swap",
      amount: "$1,000,000,000 USDT",
      recipient: "10 BTC",
    },
    {
      id: "4",
      type: "Send",
      amount: "$1,000,000,000 USDT",
      recipient: "Jane",
    },
  ];

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
      // Start exit animation
      setIsExiting(true);
      setTimeout(() => {
        setActiveTransaction(null);
        setIsExiting(false);
      }, 300); // Match animation duration
    } else {
      setActiveTransaction(id);
    }
  };

  const handleRemove = (id: string) => {
    // Handle remove logic
    console.log("Remove transaction:", id);
    if (activeTransaction === id) {
      setIsExiting(true);
      setTimeout(() => {
        setActiveTransaction(null);
        setIsExiting(false);
      }, 300);
    }
  };

  const handleEdit = (id: string) => {
    // Handle edit logic
    console.log("Edit transaction:", id);
  };

  // Get the active transaction data
  const activeTransactionData = activeTransaction ? transactions.find(t => t.id === activeTransaction) : null;

  return (
    <div className="flex flex-row gap-1 w-full h-full bg-app-background">
      <div className="flex flex-col gap-5 p-3 bg-background rounded-lg flex-1 border border-divider">
        <div className="flex flex-row h-[100px] w-full justify-between">
          <div className="w-full relative">
            <img src="/misc/shopping-bag.svg" alt="clock" className="w-[150px]" />
            <div className="absolute -bottom-5 left-0 right-0 h-30 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
          </div>
        </div>
        <Header />
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
        />
      </div>

      {activeTransactionData && (
        <div className={`overflow-hidden ${isExiting ? "animate-slide-out" : "animate-slide-in"}`}>
          <TransactionSummary
            className="w-[400px]"
            transactions={[
              {
                amount: activeTransactionData.amount,
                type: activeTransactionData.type.toLowerCase() as "send" | "swap",
                recipient: activeTransactionData.recipient,
                id: activeTransactionData.id,
              },
            ]}
            onConfirm={() => {
              console.log("Confirming transaction:", activeTransactionData.id);
              setIsExiting(true);
              setTimeout(() => {
                setActiveTransaction(null);
                setIsExiting(false);
              }, 300);
            }}
          />
        </div>
      )}
    </div>
  );
}
