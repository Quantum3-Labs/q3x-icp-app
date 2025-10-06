import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import AccountSidebar from "../Account/AccountSidebar";
import { useAuthStore } from "@/store";
import PrimaryButton from "./Button/PrimaryButton";

export const ACCOUNT_SIDEBAR_OFFSET = 285; // Main sidebar width
export const NEW_SUB_ACCOUNT_SIDEBAR_OFFSET = 567; // Account sidebar width + gap

const SIDEBAR_LINKS = {
  DASHBOARD: "/dashboard",
  ADDRESS_BOOK: "/address-book",
  AI_ASSISTANT: "/ai-assistant",
  SEND: "/send",
  SWAP: "/swap",
  TRANSACTIONS: "/transactions",
  BATCH: "/batch",
  VETKEYS: "/vetkeys",
};

const sectionItems = [
  {
    label: "Quick Access",
    description: "Shortcuts to your power tools.",
    menuItems: [
      { icon: "/sidebar/dashboard.svg", label: "dashboard", link: SIDEBAR_LINKS.DASHBOARD },
      { icon: "/sidebar/address-book.svg", label: "address book", link: SIDEBAR_LINKS.ADDRESS_BOOK },
      { icon: "/sidebar/ai-assistant.svg", label: "ai assistant", link: SIDEBAR_LINKS.AI_ASSISTANT },
      { icon: "/logo/icp-avatar.svg", label: "Vetkey", link: SIDEBAR_LINKS.VETKEYS },
    ],
  },
  {
    label: "Payments",
    description: "Move assets your way – fast, private.",
    menuItems: [
      { icon: "/sidebar/send.svg", label: "send", link: SIDEBAR_LINKS.SEND },
      { icon: "/sidebar/swap.svg", label: "swap", link: SIDEBAR_LINKS.SWAP },
      { icon: "/sidebar/batch.svg", label: "batch", transactionsCount: 10, link: SIDEBAR_LINKS.BATCH },
    ],
  },
  {
    label: "teams",
    description: "Multi-sig? Shared control? It's all here.",
    menuItems: [
      {
        icon: "/sidebar/transaction.svg",
        label: "transactions",
        transactionsCount: 10,
        link: SIDEBAR_LINKS.TRANSACTIONS,
      },
    ],
  },
];

const SectionItem = ({
  label,
  description,
  menuItems,
  showDivider,
  selectedItem,
  onItemClick,
}: {
  label: string;
  description: string;
  menuItems: { icon: string; label: string; transactionsCount?: number; link: string }[];
  showDivider?: boolean;
  selectedItem: string | null;
  onItemClick: (itemLabel: string) => void;
}) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const router = useRouter();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col">
        <span className="text-lg font-bold text-text-primary uppercase">{label}</span>
        <span className="text-sm text-text-secondary">{description}</span>
      </div>
      <div className="flex flex-col gap-0.5">
        {menuItems.map(item => (
          <div
            key={item.label}
            className={`group flex flex-row items-center gap-3 px-2 py-2 rounded-[12px] cursor-pointer justify-between uppercase ${
              selectedItem === item.link
                ? "bg-primary text-white"
                : "text-text-primary hover:bg-primary hover:text-white"
            }`}
            onClick={() => router.push(item.link)}
            onMouseEnter={() => setHoveredItem(item.link)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <div className="flex flex-row items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center">
                <img
                  src={item.icon}
                  alt={item.label}
                  className="scale-125"
                  style={{
                    filter:
                      selectedItem === item.link || hoveredItem === item.link ? "invert(1) brightness(1000%)" : "none",
                  }}
                />
              </div>
              <span
                className={`uppercase ${
                  selectedItem === item.link
                    ? "font-bold text-white"
                    : "font-normal text-text-primary group-hover:font-bold group-hover:text-white"
                }`}
              >
                {item.label}
              </span>
            </div>
            {item.transactionsCount && item.transactionsCount > 0 && (
              <button className="flex flex-row items-center gap-2 bg-surface-light rounded-lg px-3 py-0.5 border border-divider text-text-primary">
                {item.transactionsCount}
              </button>
            )}
          </div>
        ))}
      </div>
      {showDivider && <div className="w-full h-[1px] my-1 bg-divider" />}
    </div>
  );
};

export default function Sidebar() {
  const pathname = usePathname();  
  // Just for testing
  const [connected, setConnected] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [showAccountSidebar, setShowAccountSidebar] = useState(false);
  const router = useRouter();
  const { principal } = useAuthStore();

  const handleItemClick = (itemLabel: string) => {
    setSelectedItem(itemLabel);
  };

  const handleAccountClick = () => {
    setShowAccountSidebar(!showAccountSidebar);
  };

  useEffect(() => {
    const path = pathname.split("/")[1];
    setSelectedItem(`/${path}`);
  }, [pathname]);

  return (
    <>
      <div className="bg-background relative rounded-lg h-screen min-w-[280px] max-w-[280px] justify-between flex flex-col z-30 border border-[#EDEDED] py-1">
        <div className="p-3">
          {/* Header */}
          <div className="flex flex-row items-center gap-3" onClick={() => router.push('/')}>
            <img src="/logo/q3x-logo-icon.svg" alt="logo" className="w-8 h-8" />
            <img src="/logo/q3x-text.svg" alt="logo" className="scale-110" />
            <div className="flex flex-row items-center justify-center rounded-full px-3 py-1 bg-divider">
              <span className="text-sm text-text-secondary">Beta</span>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-[1px] my-3 bg-divider" />

          {/* Menu */}
          <div className="flex flex-col gap-2">
            {sectionItems.map((item, index) => (
              <SectionItem
                key={item.label}
                label={item.label}
                description={item.description}
                menuItems={item.menuItems}
                showDivider={index < sectionItems.length - 1}
                selectedItem={selectedItem}
                onItemClick={handleItemClick}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2 px-1">
          {/* Request new feature */}
          <div className="px-3">
            <div className="flex flex-row items-center gap-2">
              <div className="flex items-center justify-center rounded-[12px] px-4 py-3 leading-none bg-surface-light">
                <img src="/misc/plus-icon.svg" alt="plus" className="w-4 h-4" />
              </div>
              <div className="flex rounded-[12px] w-full py-3 px-3 leading-none bg-surface-light">
                <span className="text-text-secondary">Request new feature</span>
              </div>
            </div>
          </div>

          {/* Account */}
          <div className="flex flex-col">
            {connected ? (
              <>
              <div
              className="flex items-center px-4 py-3 justify-between bg-surface-blue cursor-pointer hover:bg-surface-blue/80 transition-colors"
              onClick={handleAccountClick}
            >
              <div className="flex flex-row items-center gap-2">
                <img src="/logo/icp-avatar.svg" alt="account" className="w-5 h-5" />
                <span className="text-text-secondary">{principal ? principal.slice(0, 6) + "..." + principal.slice(-4) : "Not connected"}</span>
                {/* <img src="/misc/copy-icon.svg" alt="copy" className="w-4 h-4" /> */}
              </div>
              <img src="/misc/power-button-icon.svg" alt="logout" className="w-5 h-5" />
            </div>
            <div className="flex rounded-b-lg w-full py-2 px-3 justify-between bg-tertiary">
              <div className="flex flex-row items-center gap-2">
                <img src="/misc/ticket-icon.svg" alt="ticket" className="w-5 h-5" />
                <span className="text-white">Current plan</span>
              </div>
              <div className="flex flex-row items-center rounded-lg px-3 py-1 bg-white">
                <span className="text-text-primary">Free</span>
              </div>
            </div>
              </>
            ) : (
              <PrimaryButton onClick={() => setConnected(true)} text="Connect your account" />
            )}
          </div>
        </div>
      </div>

      {/* Account Sidebar */}
      <AccountSidebar isOpen={showAccountSidebar} onClose={() => setShowAccountSidebar(false)} />
    </>
  );
}
