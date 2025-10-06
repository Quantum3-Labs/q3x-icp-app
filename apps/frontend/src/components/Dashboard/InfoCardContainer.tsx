"use client";
import React, { useState } from "react";
import { WalletData } from "./DashboardContainer";
import SignersModal from "./SignersModal";

interface InfoCardContainerProps {
  walletData?: WalletData[];
  walletName?: string;
  pendingTransaction?: number;
  onUpdate: () => void;
  loading?: boolean;
}

const InfoCardContainer: React.FC<InfoCardContainerProps> = ({
  walletData = [],
  walletName = "Default",
  pendingTransaction,
  onUpdate,
  loading,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSeeAllClick = () => {
    if (walletData.length > 0) {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <div className="flex gap-2 h-full w-full">
        {/* Account Card */}
        <div className="flex-1 bg-surface-light rounded-lg p-3 pt-2 flex flex-col justify-between">
          <div className="flex items-center justify-between w-full">
            <span className="text-text-secondary text-[15px] capitalize ">Account</span>
            <img src="/misc/reset-icon.svg" alt="arrow-right" className="w-4 h-4" />
          </div>
          <span className="text-text-primary text-[20px] tracking-[-0.2px] w-full">
            <span>ICP [</span>
            <span className="text-primary">{walletName}</span>
            <span>]</span>
          </span>
        </div>

        {/* Pending Transactions Card */}
        <div className="flex-1 bg-surface-light rounded-lg p-3 pt-2 flex flex-col justify-between">
          <span className="text-text-secondary text-[15px] capitalize ">Pending transactions</span>
          <span className="text-text-primary text-[20px] tracking-[-0.2px] w-full">{pendingTransaction}</span>
        </div>

        {/* Signers List Card */}
        <div className="flex-1 bg-surface-light rounded-lg p-3 pt-2 flex flex-col justify-between">
          <div className="flex items-center justify-between w-full ">
            <span className="text-text-secondary text-[15px] capitalize">Signers list</span>
            <span className="text-primary text-[16px] tracking-[-0.16px] cursor-pointer" onClick={handleSeeAllClick}>
              See all
            </span>
          </div>
          {loading ? (
            <span>Loading...</span>
          ) : (
            <span className="text-text-primary text-[20px] tracking-[-0.2px] ">
              {walletData.length > 0 ? `${walletData[0]?.threshold}/${walletData[0]?.signers?.length}` : "0/0"}
            </span>
          )}
        </div>
      </div>
      {/* Modal */}
      {walletData && (
        <SignersModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          walletData={walletData[0]}
          walletId={walletName}
          onUpdate={onUpdate}
        />
      )}
    </>
  );
};

export default InfoCardContainer;
