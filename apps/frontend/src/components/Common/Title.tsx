"use client";

import { usePathname } from "next/navigation";
import React from "react";

const Title: React.FC = () => {
  const pathname = usePathname();
  let title;

  switch (pathname) {
    case "/dashboard":
      title = "Dashboard";
      break;
    case "/dashboard/new-account":
      title = "Create New Account";
      break;
    case "/address-book":
      title = "Address Book";
      break;
    case "/ai-assistant":
      title = "AI Assistant";
      break;
    case "/send":
      title = "Send Token";
      break;
    case "/swap":
      title = "Swap Token";
      break;
    case "/batch":
      title = "Your Batch";
      break;
    case "/transactions":
      title = "Transactions";
      break;
  }

  return (
    <div className="flex flex-row gap-1 pt-1">
      {/* Title */}
      <div className={`flex gap-1.5 items-center justify-start w-full`}>
        <div className="flex gap-[7px] items-center px-3 py-2 rounded-[10px] bg-background border border-secondary min-w-0 flex-1">
          <img src="/arrow/filled-blue-arrow-right.svg" alt="icon" className="w-5 h-5" />
          <div className="text-[17px] text-text-primary uppercase font-bold">{title}</div>
        </div>
      </div>
      {/* Portfolio */}
      <div className="flex flex-row gap-2 w-[150px] justify-center items-center bg-secondary rounded-lg">
        <img src="/misc/coin-icon.gif" alt="portfolio" className="w-4 h-4" />
        <span className="text-text-primary">PORTFOLIO</span>
      </div>
      {/* Notification */}
      <div className="flex flex-row gap-2 w-[50px] justify-center items-center bg-secondary rounded-lg">
        <img src="/misc/bell-icon.gif" alt="notification" className="w-5 h-5" />
      </div>
    </div>
  );
};

export default Title;
