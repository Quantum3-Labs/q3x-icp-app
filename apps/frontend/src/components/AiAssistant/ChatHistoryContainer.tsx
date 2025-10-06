import React from "react";

// Chat history item component
function ChatHistoryItem({ message, highlightedText }: { message: string; highlightedText?: string }) {
  return (
    <div className="bg-surface-light flex gap-[5px] items-center justify-between px-3 py-3.5 rounded-[10px] w-full">
      <div className="flex flex-col justify-center text-text-secondary text-[15px]">
        {highlightedText ? (
          <p className="leading-none">
            <span className="font-normal">{message.replace(highlightedText, "")}</span>
            <span className="font-bold text-text-primary">{highlightedText}</span>
          </p>
        ) : (
          <p className="leading-none">{message}</p>
        )}
      </div>
      <img src="/misc/three-dots.svg" alt="three-dot-menu" className="w-5 h-5" />
    </div>
  );
}

export default function ChatHistoryContainer({ className }: { className?: string }) {
  return (
    <div
      className={`bg-background flex flex-col rounded-[8px] justify-between h-full w-full ${className} border border-divider`}
    >
      {/* Header */}
      <div className="flex flex-col gap-4 p-3">
        <div className=" flex flex-col gap-[3px] items-start left-3 right-3 top-3">
          <span className="font-semibold text-text-primary text-[17px] uppercase w-full leading-none">
            chat history
          </span>
          <span className="font-normal text-text-secondary text-[15px] w-full leading-none">
            Below are your accounts and sub-accounts
          </span>
        </div>

        {/* Chat History Items */}
        <div className=" flex flex-col gap-[5px] items-center">
          <ChatHistoryItem message="Swap 1,000USDT to ETH and send to @Aloy" highlightedText="@Aloy" />
          <ChatHistoryItem message="Below are your accounts and sub-accounts" />
        </div>
      </div>

      {/* New Chat Button */}
      <div className="bg-[#F7F7F7] pl-5 pr-4 py-4 flex justify-center items-center border-t border-divider rounded-b-lg">
        <button className="bg-gradient-to-b from-[#48b3ff] to-[#0059ff] flex gap-2 items-center justify-center px-5 py-2 rounded-[10px] shadow-[0px_2px_4px_-1px_rgba(12,12,106,0.5),0px_0px_0px_1px_#4470ff] w-[354px]">
          <span className="font-semibold text-[16px] text-center text-white leading-none">New chat</span>
        </button>
      </div>
    </div>
  );
}
