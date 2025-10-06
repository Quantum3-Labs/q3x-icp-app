"use client";

import { useState } from "react";

export default function ChatBoxContainer({ className }: { className?: string }) {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = () => {
    if (inputValue.trim()) {
      console.log("Submitting:", inputValue);
      setInputValue("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 h-full w-full ${className} border border-divider rounded-lg bg-background`}
    >
      {/* AI Assistant icon */}
      <img src="/ai-assistant/ai-assistant-icon.svg" alt="AI Assistant" className="w-10 h-10 mb-2" />

      {/* Main heading */}
      <div className="font-medium leading-none text-text-secondary text-xl text-center uppercase">
        <span>What </span>
        <span className="font-semibold text-text-primary">transaction</span>
        <span> do you want to do ?</span>
      </div>

      {/* Prompt Input Container */}
      <div className=" backdrop-blur-[6px] bg-gray-50 left-1/2 rounded-3xl  w-[542px] shadow-lg border border-gray-200 p-3">
        {/* Comment Container */}
        <div className="box-border content-stretch flex gap-2 items-start justify-start p-2 relative shrink-0 w-full">
          <textarea
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="How can i help you today"
            className="w-full h-[40px] bg-transparent border-none outline-none resize-none text-gray-800 text-sm placeholder-gray-400 font-['Barlow:Regular',_sans-serif]"
            aria-label="AI Assistant input"
          />
        </div>

        {/* Input and Actions Container */}
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSubmit();
          }}
          className=" flex items-center justify-between w-full"
        >
          {/* Text Input Field */}
          <div className="flex items-center justify-center p-2 bg-[#EDEDED] rounded-lg leading-none">
            <img src="/ai-assistant/at-icon.svg" alt="At" className="w-4 h-4" />
          </div>

          {/* Comment Actions */}
          <div className="content-stretch flex gap-2 items-center justify-start">
            {/* Voice Button */}
            <button
              onClick={() => console.log("Voice input activated")}
              className="box-border content-stretch flex gap-3 h-10 items-center justify-start overflow-clip px-2.5 py-1 relative rounded-xl shrink-0 cursor-pointer hover:bg-gray-100 transition-colors"
              aria-label="Activate voice input"
            >
              <img src="/ai-assistant/mic-icon.svg" alt="Voice" className="w-5 h-5" />
            </button>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={!inputValue.trim()}
              className="bg-[#e0e0e0] box-border content-stretch flex gap-2 items-center justify-center overflow-clip p-2 relative rounded-[12px] shadow-[0px_3px_4px_-1px_rgba(0,0,0,0.15),0px_0px_0px_1px_#d4d4d4] size-full disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Send message"
              title="Send message"
            >
              <img src="/arrow/thin-arrow-up.svg" alt="Send" className="w-4 h-4" />
              <div className="absolute inset-0 pointer-events-none shadow-[0px_1px_0px_0px_inset_rgba(255,255,255,0.33)]" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
