import { copyAddressToClipboard, getAmountByCoinType, getAmountInICP, getShortenedAddress } from "@/utils/helper";
import Badge from "./Badge";
import { useState } from "react";
import { BatchTransaction, MessageType, TransactionTypeBatch } from "@/utils/messages";
import { useAuthStore } from "@/store";
import { Principal } from "@dfinity/principal";

interface TransactionRowProps {
  keyTx: string;
  loading?: boolean;
  type: MessageType;
  amount?: string;
  to?: string;
  oldThreshold?: number;
  newThreshold?: string;
  signers?: string[];
  approvedSigners?: string[];
  approveNumber?: number;
  status?: "success" | "failed";
  batchData?: BatchTransaction;
  isApproved?: boolean;
  showButtons?: boolean;
  showExternalLink?: boolean;
  isHistory?: boolean;
  onApprove?: () => void;
}

export default function TransactionRow({
  keyTx,
  loading = false,
  type,
  amount,
  to,
  oldThreshold,
  newThreshold,
  signers,
  approvedSigners,
  approveNumber,
  status,
  batchData,
  isApproved,
  showButtons = true,
  isHistory = false,
  showExternalLink = false,
  onApprove,
}: TransactionRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showChevron, setShowChevron] = useState(true);
  const [isActive, setIsActive] = useState(false);

  const { principal } = useAuthStore();

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
    setIsActive(!isActive);
    setShowChevron(isExpanded);
  };

  const arrowThinLong = (
    <img
      src="/arrow/thin-long-arrow-right.svg"
      alt="chevron"
      className={`w-15 group-hover:brightness-0 group-hover:invert ${isActive ? "filter brightness-0 invert" : ""}`}
    />
  );

  const activeClass = isActive ? "text-white" : "";

  const getMessageByType = (type: MessageType) => {
    switch (type) {
      case MessageType.ADD_SIGNER:
        return "Add Signer";
      case MessageType.REMOVE_SIGNER:
        return "Remove Signer";
      case MessageType.SET_THRESHOLD:
        return "Threshold";
      case MessageType.TRANSFER:
      case MessageType.TRANSFER_EVM:
        return "Send";
      case MessageType.BATCH:
        return "Batch";
      default:
        return "Unknown";
    }
  };

  const getCoinByMessageType = (type: MessageType) => {
    switch (type) {
      case MessageType.TRANSFER:
        return "ICP";
      case MessageType.TRANSFER_EVM:
        return "ETH";
      default:
        return "";
    }
  };

  const listApprovedSigners = !isHistory
    ? approvedSigners?.map(signer => {
        return (
          <div className="bg-[#EEFDF2] flex flex-row gap-2 pl-5 pr-2.5 py-2.5 w-full justify-between" key={keyTx}>
            <span className="text-text-primary text-base leading-none">
              {principal === signer ? <>Your account</> : <span className="text-primary">{signer}</span>}
            </span>
            <span className="text-[#28A066] text-base leading-none">Approved</span>
          </div>
        );
      })
    : null;

  const copyIcon = (address: string) => (
    <div className="shrink-0 size-4 cursor-pointer">
      <img
        onClick={() => copyAddressToClipboard(address)}
        src="/misc/copy-icon.svg"
        alt="copy"
        className="w-full h-full"
      />
    </div>
  );

  const renderContent = () => {
    switch (type) {
      case MessageType.SET_THRESHOLD:
        return (
          <>
            <span className={`text-text-primary group-hover:text-white ${activeClass}`}>{oldThreshold}</span>
            {arrowThinLong}
            <span className={`text-text-primary group-hover:text-white ${activeClass}`}>{newThreshold}</span>
          </>
        );

      case MessageType.ADD_SIGNER:
        return (
          <div className="flex items-center gap-[7px]">
            {signers?.map((signer, index) => (
              <div
                key={index}
                className={`flex items-center justify-center px-2 py-[5px] rounded-full ${
                  type === MessageType.ADD_SIGNER
                    ? isActive
                      ? "bg-white"
                      : "bg-primary group-hover:bg-white"
                    : "bg-[#7b7b7b]"
                }`}
              >
                <span
                  className={`font-barlow-medium text-xs leading-none ${
                    type === MessageType.ADD_SIGNER
                      ? isActive
                        ? "text-primary"
                        : "text-white group-hover:text-primary"
                      : "text-white"
                  }`}
                >
                  {getShortenedAddress(signer)}
                </span>
              </div>
            ))}
          </div>
        );

      case MessageType.REMOVE_SIGNER:
        return (
          <div className="flex items-center gap-[7px]">
            {signers?.map((signer, index) => (
              <div
                key={index}
                className={`flex items-center justify-center px-2 py-[5px] rounded-full ${
                  type === MessageType.REMOVE_SIGNER ? "bg-[#7b7b7b]" : "bg-primary"
                }`}
              >
                <span className="font-barlow-medium text-white text-xs leading-none ">
                  {getShortenedAddress(signer)}
                </span>
              </div>
            ))}
          </div>
        );

      case MessageType.TRANSFER:
      case MessageType.TRANSFER_EVM:
        return (
          <>
            <span className={`text-text-primary leading-none group-hover:text-white ${activeClass}`}>
              {getAmountByCoinType(amount ?? "0", getCoinByMessageType(type))} {getCoinByMessageType(type)}
            </span>
            {arrowThinLong}
            <span className={`text-text-primary leading-none group-hover:text-white`}>
              <span className={`-medium text-primary group-hover:text-white ${activeClass}`}>
                To: [{getShortenedAddress(to ?? "")}]
              </span>
            </span>
          </>
        );

      case MessageType.BATCH:
        return (
          <span className={`text-text-primary leading-none group-hover:text-white ${activeClass}`}>
            {batchData?.transactions.length} Transactions
          </span>
        );
      default:
        return (
          <>
            <span className={`text-text-primary leading-none ${"group-hover:text-white"} ${activeClass}`}>
              {getAmountInICP(amount ?? "0")} ICP
            </span>
            {arrowThinLong}
            <span className={`text-text-primary leading-none group-hover:text-white`}>
              <span className={`-medium text-primary group-hover:text-white ${activeClass}`}>
                To: [{getShortenedAddress(to ?? "")}]
              </span>
            </span>
          </>
        );
    }
  };

  const renderExpandedContent = () => {
    if (!isExpanded) return null;

    switch (type) {
      case MessageType.ADD_SIGNER:
        return (
          <div className="relative flex flex-col gap-1 pt-0.5 pl-2" key={keyTx}>
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
                  {copyIcon(signer)}
                </div>
              ))}
            </div>
            {listApprovedSigners}
          </div>
        );
      case MessageType.REMOVE_SIGNER:
        return (
          <div className="relative flex flex-col gap-1 pt-0.5 pl-2" key={keyTx}>
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary"></div>
            <div className="bg-[#ededed] flex flex-col gap-2 pl-5 pr-2.5 py-2.5 w-full">
              {signers?.map((signer, index) => (
                <div key={index} className="flex gap-[5px] items-center justify-between w-full">
                  <div className="grow text-[#363636] text-base leading-none">
                    Address {String(index + 1).padStart(2, "0")} Removed
                  </div>
                  <div className="text-[#363636] text-base text-nowrap leading-none">
                    <span>[</span>
                    <span className="text-primary">{signer}</span>
                    <span>]</span>
                  </div>
                  {copyIcon(signer)}
                </div>
              ))}
            </div>
            {listApprovedSigners}
          </div>
        );
      case MessageType.SET_THRESHOLD:
        return (
          <div className="relative flex flex-col gap-1 pt-0.5 pl-2" key={keyTx}>
            {listApprovedSigners}
          </div>
        );
      case MessageType.TRANSFER:
      case MessageType.TRANSFER_EVM:
        return (
          <div className="relative flex flex-col gap-1 pt-0.5 pl-2" key={keyTx}>
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary"></div>
            <div className="bg-[#ededed] flex flex-col gap-2 pl-5 pr-2.5 py-2.5 w-full">
              <div className="flex gap-[5px] items-center justify-between w-full">
                <div className="grow text-[#363636] text-base leading-none">Sent to address</div>
                <div className="text-[#363636] text-base text-nowrap leading-none">
                  <span>[</span>
                  <span className="text-primary">{to}</span>
                  <span>]</span>
                </div>
                {copyIcon(to ?? "")}
              </div>
            </div>
            {listApprovedSigners}
          </div>
        );
      case MessageType.BATCH:
        return (
          <>
            {batchData?.transactions.map(tx => {
              console.log("🚀 ~ renderExpandedContent ~ tx:", tx);
              if ("EvmTransfer" in tx) {
                const evmTx = tx.EvmTransfer;
                return (
                  <div className="relative flex flex-col gap-1 pt-0.5 pl-2" key={evmTx.to}>
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary"></div>
                    <div className="bg-[#ededed] grid grid-cols-[auto_1fr] gap-x-20 gap-y-2 pl-5 pr-2.5 py-2.5 w-full text-text-primary">
                      <span>Send</span>
                      <div className="flex flex-row gap-2 items-center">
                        <span>{getAmountByCoinType(evmTx.value.toString(), "ETH")} ETH</span>
                        <img src="/arrow/thin-long-arrow-right.svg" alt="chevron" className="w-15" />
                        <span>
                          [<span className="text-primary">{evmTx.to}</span>]
                        </span>
                        {copyIcon(evmTx.to)}
                      </div>
                    </div>
                  </div>
                );
              } else if ("IcpTransfer" in tx) {
                const icpTx = tx.IcpTransfer;
                return (
                  <div className="relative flex flex-col gap-1 pt-0.5 pl-2" key={keyTx}>
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary"></div>
                    <div className="bg-[#ededed] grid grid-cols-[auto_1fr] gap-x-20 gap-y-2 pl-5 pr-2.5 py-2.5 w-full text-text-primary">
                      <span>Send</span>
                      <div className="flex flex-row gap-2 items-center">
                        <span>{getAmountByCoinType(icpTx.amount.toString(), "ICP")} ICP</span>
                        <img src="/arrow/thin-long-arrow-right.svg" alt="chevron" className="w-15" />
                        <span>
                          [<span className="text-primary">{Principal.from(icpTx.to_principal).toText()}</span>]{" "}
                        </span>
                        {copyIcon(Principal.from(icpTx.to_principal).toText())}
                      </div>
                    </div>
                  </div>
                );
              }
            })}
          </>
        );
    }
  };

  return (
    <div className="flex flex-col w-full rounded-[10px] mb-2">
      <div
        className={`bg-[#f7f7f7] flex items-center gap-[7px] p-2 w-full justify-between flex-row
          cursor-pointer hover:bg-primary group  rounded-[10px]
        ${isActive ? "bg-primary text-white" : ""}`}
        onClick={handleToggleExpand}
      >
        <div className="flex items-center gap-[7px]">
          <span
            className={`text-text-primary text-base leading-none w-[110px] shrink-0
         group-hover:text-white ${activeClass}`}
          >
            {getMessageByType(type)}
          </span>
          {renderContent()}
        </div>

        <div className="flex items-center gap-[7px]">
          {status && <Badge status={status} />}

          {showButtons && (
            <div className="flex items-center gap-[7px] shrink-0 group-hover:text-white">
              <div>
                {approveNumber} / {oldThreshold}
              </div>
              <div className="bg-gradient-to-b from-[#9c9c9c] to-[#303030] flex items-center px-5 py-1.5 rounded-[10px] shadow-[0px_2px_4px_-1px_rgba(131,131,131,0.5),0px_0px_0px_1px_#a1a1a1]">
                {loading ? (
                  <span>Loading...</span>
                ) : (
                  <span className="font-medium text-white text-sm text-center" onClick={onApprove}>
                    {isApproved ? "Approved" : "Approve"}
                  </span>
                )}
              </div>
            </div>
          )}

          {showChevron ? (
            <img src="/arrow/chevron-down.svg" alt="chevron" className={`w-5 h-5 group-hover:brightness-[1000%]`} />
          ) : (
            <img
              src="/arrow/chevron-right.svg"
              alt="chevron"
              className={`w-5 h-5 group-hover:brightness-[1000%] ${isActive ? "brightness-[1000%]" : ""}`}
            />
          )}
        </div>
      </div>

      {renderExpandedContent()}
    </div>
  );
}
