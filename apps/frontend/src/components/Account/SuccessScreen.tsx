"use client";
import { useWalletStore } from "@/store";
import { copyAddressToClipboard, getAccountAddressFromPrincipal } from "@/utils/helper";
import { Wallet } from "@q3x/models";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { ReceiveModal } from "../Modals/ReceiveModal";

interface SuccessScreenProps {
  className?: string;
}

const SuccessScreen: React.FC<SuccessScreenProps> = ({ className }) => {
  const { currentWallet, getCurrentNetwork } = useWalletStore();
  const router = useRouter();

  const [addressCanister, setAddressCanister] = React.useState(
    getAccountAddressFromPrincipal(currentWallet?.canisterId || ""),
  );
  console.log("🚀 ~ SuccessScreen ~ addressCanister:", addressCanister)

  const handleSeeAccount = () => {
    router.push(`/dashboard`);
  };

  const handleFundAccount = () => {
    // TODO: Open funding flow
    console.log("Open funding flow");
  };

  return (
    <div
      className={`overflow-hidden relative w-full h-full flex flex-col rounded-lg bg-background ${className} border border-divider`}
    >
      {/* Earth background */}
      <div className="w-full relative">
        <div className="absolute top-0 flex h-[736.674px] items-center justify-center left-1/2 translate-x-[-50%] w-[780px] pointer-events-none">
          <img src="/send/top-globe.svg" alt="Bottom globe" className="w-full h-full" />
        </div>
        <div className="absolute top-10 left-0 right-0 h-[400px] w-full bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
      </div>

      {/* Success content */}
      <div className="flex flex-col gap-[20px] items-center justify-center flex-1 px-4 relative z-10">
        {/* Success title */}
        <div className="flex flex-col items-center justify-center pb-8">
          <div className="text-[#545454] text-6xl text-center font-bold uppercase w-full">SUCCESSFULLY</div>
          <div className="text-[#545454] text-6xl text-center font-bold uppercase w-full">CREATED</div>
          <div className="flex gap-[5px] items-center justify-center w-full">
            <div className="text-[#545454] text-6xl text-center font-bold uppercase">ACC</div>
            <div className="h-[48px] relative rounded-full w-[125.07px] border-[4.648px] border-primary border-solid"></div>
            <div className="text-[#545454] text-6xl text-center font-bold uppercase">UNT</div>
          </div>
        </div>

        {/* Success icon with rotation animation */}
        <Image src={"/logo/q3x-apple.svg"} alt="Success Icon" width={100} height={100} />

        {/* Wallet info */}
        <div className="bg-gray rounded-2xl p-8 shadow-lg w-full max-w-lg mx-4">
          <div className="text-center">
            <h3 className="text-[#545454] text-[32px] font-normal mb-6">{currentWallet?.name}</h3>
            <div
              className="font-mono text-[16px] text-[#545454] leading-relaxed break-all mb-8 px-2 cursor-pointer"
              onClick={() => {
                copyAddressToClipboard(addressCanister);
              }}
            >
              {addressCanister}
            </div>

            {/* Action buttons */}
            <div className="flex gap-4 items-center justify-center w-full">
              <button
                onClick={handleSeeAccount}
                className="flex-1 bg-gradient-to-b from-[#e74c3c] to-[#c0392b] flex items-center justify-center px-6 py-4 rounded-[12px] shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
              >
                <span className="font-semibold text-[18px] text-center text-white">See your account</span>
              </button>
              <button
                onClick={handleFundAccount}
                className="flex-1 bg-gradient-to-b from-[#48b3ff] to-[#0059ff] flex items-center justify-center px-6 py-4 rounded-[12px] shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
              >
                <ReceiveModal address={addressCanister} symbol="icp">
                  <span className="font-semibold text-[18px] text-center text-white">Fund your account</span>
                </ReceiveModal>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessScreen;
