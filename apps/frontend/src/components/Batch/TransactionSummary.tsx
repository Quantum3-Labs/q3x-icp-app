"use client";

import React from "react";

interface Transaction {
  id: string;
  amount: string;
  type: "send" | "swap";
  recipient: string;
}

interface TransactionSummaryProps {
  transactions: Transaction[];
  onConfirm?: () => void;
  className?: string;
}

const TransactionSummary: React.FC<TransactionSummaryProps> = ({ transactions, onConfirm, className }) => {
  return (
    <div className={`bg-white relative rounded-lg h-full overflow-hidden border border-primary ${className}`}>
      {/* Header Section */}
      <div className="flex flex-col gap-3 items-start justify-start p-3 w-full">
        {/* Icon */}
        <img src="/misc/shopping-bag.svg" alt="Batch transactions" className="w-20 h-20" />

        {/* Title and Description */}
        <div className="flex flex-col gap-[3px] items-start justify-start w-full">
          <div className="font-semibold text-[#363636] text-2xl tracking-[-0.72px] uppercase w-full">
            Transactions summary
          </div>
          <div className="text-[#999999] text-lg tracking-[-0.54px] w-full">
            Please review the information below and confirm to make the transaction.
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="flex flex-col gap-0.5 h-[557.543px] items-center justify-start px-3 py-0 w-full">
        {transactions.map(transaction => (
          <div
            key={transaction.id}
            className="bg-[#f7f7f7] flex gap-[7px] h-[52px] items-center justify-start p-[10px] w-full"
          >
            {/* Amount */}
            <div className="grow text-[#363636] text-[16px] ">${transaction.amount}</div>

            {/* Arrow */}
            <div className="relative w-18">
              {transaction.type === "send" ? (
                <img src="/arrow/thin-long-arrow-right.svg" alt="arrow" className="w-full h-full" />
              ) : (
                <img src="/arrow/thin-long-arrow-left-right.svg" alt="arrow" className="w-full h-full" />
              )}
            </div>

            {/* Recipient */}
            <div className="text-[#363636] text-[16px]">To: {transaction.recipient}</div>
          </div>
        ))}
      </div>

      {/* Confirm Button Section */}
      <div className="bg-[#f7f7f7] absolute bottom-0 left-1/2 translate-x-[-50%] w-full px-5 py-4 border-t border-[#e0e0e0]">
        <button
          onClick={onConfirm}
          className="bg-gradient-to-b from-[#48b3ff] to-[#0059ff] flex items-center justify-center px-5 py-2 rounded-[10px] shadow-[0px_2px_4px_-1px_rgba(12,12,106,0.5),0px_0px_0px_1px_#4470ff] w-full"
        >
          <span className="font-semibold text-[16px] text-center text-white tracking-[-0.16px]">Confirm</span>
        </button>
      </div>
    </div>
  );
};

export default TransactionSummary;
