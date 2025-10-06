import Badge from "./Badge";
import { useState } from "react";

export enum TransactionType {
  SEND = "Send",
  SWAP = "Swap",
  THRESHOLD = "Threshold",
  ADD_SIGNER = "Add Signer",
  REMOVE_SIGNER = "Remove Signer",
  BATCH = "Batch",
}

interface TransactionRowProps {
  type: TransactionType;
  amount?: string;
  to?: string;
  threshold?: string;
  signers?: string[];
  status?: "success" | "failed";
  showButtons?: boolean;
  showChevron?: boolean;
  showExternalLink?: boolean;
}

export default function TransactionRow({
  type,
  amount,
  to,
  threshold,
  signers,
  status,
  showButtons = true,
  showChevron = true,
  showExternalLink = false,
}: TransactionRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const isExpandable = type === TransactionType.ADD_SIGNER || type === TransactionType.BATCH;

  const handleToggleExpand = () => {
    if (isExpandable) {
      setIsExpanded(!isExpanded);
      setIsActive(!isActive);
    }
  };

  const renderContent = () => {
    switch (type) {
      case TransactionType.THRESHOLD:
        return (
          <>
            <span
              className={`text-text-primary ${isExpandable ? "group-hover:text-white" : ""} ${
                isActive ? "text-white" : ""
              }`}
            >
              03
            </span>
            <img src="/arrow/thin-long-arrow-right.svg" alt="chevron" className="w-15" />
            <span
              className={`text-text-primary ${isExpandable ? "group-hover:text-white" : ""} ${
                isActive ? "text-white" : ""
              }`}
            >
              05
            </span>
          </>
        );

      case TransactionType.ADD_SIGNER:
        return (
          <div className="flex items-center gap-[7px]">
            {signers?.map((signer, index) => (
              <div
                key={index}
                className={`flex items-center justify-center px-2 py-[5px] rounded-full ${
                  type === TransactionType.ADD_SIGNER
                    ? isActive
                      ? "bg-white"
                      : "bg-primary group-hover:bg-white"
                    : "bg-[#7b7b7b]"
                }`}
              >
                <span
                  className={`font-barlow-medium text-xs leading-none ${
                    type === TransactionType.ADD_SIGNER
                      ? isActive
                        ? "text-primary"
                        : "text-white group-hover:text-primary"
                      : "text-white"
                  }`}
                >
                  {signer}
                </span>
              </div>
            ))}
          </div>
        );

      case TransactionType.REMOVE_SIGNER:
        return (
          <div className="flex items-center gap-[7px]">
            {signers?.map((signer, index) => (
              <div
                key={index}
                className={`flex items-center justify-center px-2 py-[5px] rounded-full ${
                  type === TransactionType.REMOVE_SIGNER ? "bg-[#7b7b7b]" : "bg-primary"
                }`}
              >
                <span className="font-barlow-medium text-white text-xs leading-none ">{signer}</span>
              </div>
            ))}
          </div>
        );

      case TransactionType.BATCH:
        return (
          <span
            className={`text-text-primary leading-none ${isExpandable ? "group-hover:text-white" : ""} ${
              isActive ? "text-white" : ""
            }`}
          >
            3 Transactions
          </span>
        );

      case TransactionType.SWAP:
        return (
          <>
            <span
              className={`text-text-primary leading-none ${isExpandable ? "group-hover:text-white" : ""} ${
                isActive ? "text-white" : ""
              }`}
            >
              {amount}
            </span>
            <img src="/arrow/thin-long-arrow-left-right.svg" alt="chevron" className="w-15" />
            <span
              className={`text-text-primary leading-none ${isExpandable ? "group-hover:text-white" : ""} ${
                isActive ? "text-white" : ""
              }`}
            >
              `To: ${to}`
            </span>
          </>
        );

      default:
        return (
          <>
            <span className={`text-text-primary leading-none ${isExpandable ? "group-hover:text-white" : ""}`}>
              {amount}
            </span>
            <img src="/arrow/thin-long-arrow-right.svg" alt="chevron" className="w-15" />
            <span className={`text-text-primary leading-none ${isExpandable ? "group-hover:text-white" : ""}`}>
              <span>To: [</span>
              <span className="-medium text-primary">{to}</span>
              <span>]</span>
            </span>
          </>
        );
    }
  };

  const renderExpandedContent = () => {
    if (!isExpandable || !isExpanded) return null;

    switch (type) {
      case TransactionType.ADD_SIGNER:
        return (
          <div className="relative flex flex-col gap-1 pt-0.5 pl-2">
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary"></div>
            <div className="bg-[#ededed] flex flex-col gap-2 pl-5 pr-2.5 py-2.5 w-full">
              {signers?.map((signer, index) => (
                <div key={index} className="flex gap-[5px] items-center justify-between w-full">
                  <div className="grow text-[#363636] text-base leading-none">
                    Address {String(index + 1).padStart(2, "0")} Added
                  </div>
                  <div className="text-[#363636] text-base text-nowrap leading-none">
                    <span>[</span>
                    <span className="text-primary">{signer}</span>
                    <span>]</span>
                  </div>
                  <div className="shrink-0 size-4">
                    <img src="/misc/copy-icon.svg" alt="copy" className="w-full h-full" />
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-[#FFF1F1] flex flex-row gap-2 pl-5 pr-2.5 py-2.5 w-full justify-between">
              <span className="text-text-primary text-base leading-none">Your Account</span>
              <span className="text-[#FF2323] text-base leading-none">Denied</span>
            </div>
            <div className="bg-[#EEFDF2] flex flex-row gap-2 pl-5 pr-2.5 py-2.5 w-full justify-between">
              <span className="text-text-primary text-base leading-none">
                John [<span className="text-primary">Transaction Initiator</span>]
              </span>
              <span className="text-[#28A066] text-base leading-none">Approved</span>
            </div>
            <div className="bg-[#EEFDF2] flex flex-row gap-2 pl-5 pr-2.5 py-2.5 w-full justify-between">
              <span className="text-text-primary text-base leading-none">Wick</span>
              <span className="text-[#28A066] text-base leading-none">Approved</span>
            </div>
          </div>
        );
      case TransactionType.BATCH:
        return (
          <div className="relative flex flex-col gap-1 pt-0.5 pl-2">
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary"></div>
            <div className="bg-[#ededed] grid grid-cols-[auto_1fr] gap-x-20 gap-y-2 pl-5 pr-2.5 py-2.5 w-full text-text-primary">
              <span>Send</span>
              <div className="flex flex-row gap-2 items-center">
                <span>$1,000,000,000 USDT</span>
                <img src="/arrow/thin-long-arrow-right.svg" alt="chevron" className="w-15" />
                <span>
                  [<span className="text-primary">Baba Yaga</span>]
                </span>
              </div>
              <span>Send</span>
              <div className="flex flex-row gap-2 items-center">
                <span>$1,000,000,000 USDT</span>
                <img src="/arrow/thin-long-arrow-right.svg" alt="chevron" className="w-15" />
                <span>
                  [<span className="text-primary">Baba Yaga</span>]
                </span>
              </div>
              <span>Swap</span>
              <div className="flex flex-row gap-2 items-center">
                <span>$1,000,000,000 USDT</span>
                <img src="/arrow/thin-long-arrow-left-right.svg" alt="chevron" className="w-15" />
                <span>To: 10 BTC</span>
              </div>
            </div>
            <div className="bg-[#FFF1F1] flex flex-row gap-2 pl-5 pr-2.5 py-2.5 w-full justify-between">
              <span className="text-text-primary text-base leading-none">Your Account</span>
              <span className="text-[#FF2323] text-base leading-none">Denied</span>
            </div>
            <div className="bg-[#EEFDF2] flex flex-row gap-2 pl-5 pr-2.5 py-2.5 w-full justify-between">
              <span className="text-text-primary text-base leading-none">
                John [<span className="text-primary">Transaction Initiator</span>]
              </span>
              <span className="text-[#28A066] text-base leading-none">Approved</span>
            </div>
            <div className="bg-[#EEFDF2] flex flex-row gap-2 pl-5 pr-2.5 py-2.5 w-full justify-between">
              <span className="text-text-primary text-base leading-none">Wick</span>
              <span className="text-[#28A066] text-base leading-none">Approved</span>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div
        className={`bg-[#f7f7f7] flex items-center gap-[7px] p-2 w-full justify-between flex-row ${
          isExpandable ? "cursor-pointer hover:bg-primary group" : ""
        } ${isActive ? "bg-primary text-white" : ""}`}
        onClick={isExpandable ? handleToggleExpand : undefined}
      >
        <div className="flex items-center gap-[7px]">
          <span
            className={`text-text-primary text-base leading-none w-[110px] shrink-0 ${
              isExpandable ? "group-hover:text-white" : ""
            } ${isActive ? "text-white" : ""}`}
          >
            {type}
          </span>
          {renderContent()}
        </div>

        <div className="flex items-center gap-[7px]">
          {status && <Badge status={status} />}

          {showButtons && (
            <div className="flex items-center gap-[7px] shrink-0">
              <div className="bg-gradient-to-b from-[#f0f0f0] to-[#b0b0b0] flex items-center justify-center px-5 py-1.5 rounded-[10px] shadow-[0px_2px_4px_-1px_rgba(131,131,131,0.5),0px_0px_0px_1px_#c6c6c6]">
                <span className="font-medium text-[#676767] text-sm text-center">Deny</span>
              </div>
              <div className="bg-gradient-to-b from-[#9c9c9c] to-[#303030] flex items-center px-5 py-1.5 rounded-[10px] shadow-[0px_2px_4px_-1px_rgba(131,131,131,0.5),0px_0px_0px_1px_#a1a1a1]">
                <span className="font-medium text-white text-sm text-center">Approve</span>
              </div>
            </div>
          )}

          {showChevron && (
            <img
              src="/arrow/chevron-down.svg"
              alt="chevron"
              className={`w-5 h-5 ${isExpandable ? "group-hover:brightness-[1000%]" : ""}`}
            />
          )}

          {showExternalLink && (
            <img
              src="/misc/external-link-icon.svg"
              alt="external link"
              className={`w-5 h-5 ${isExpandable ? "group-hover:brightness-[1000%]" : ""} ${
                isActive ? "brightness-[1000%]" : ""
              }`}
            />
          )}
        </div>
      </div>

      {renderExpandedContent()}
    </div>
  );
}
