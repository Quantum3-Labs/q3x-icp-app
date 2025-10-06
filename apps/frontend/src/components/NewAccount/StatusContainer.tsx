"use client";

import React from "react";
import { SignerData, WalletData } from "./NewAccountContainer";

interface Signer {
  id: string;
  name: string;
  address: string;
  isValid: boolean;
}

interface StatusContainerProps {
  accountName?: string;
  currentStep?: number;
  className?: string;
  walletData?: WalletData;
  onCreateWallet?: () => void;
  loading?: boolean;
  isCreating?: boolean;
  createError?: string | null;
  createSuccess?: boolean;
}

const StatusContainer: React.FC<StatusContainerProps> = ({
  accountName = "Your account name",
  currentStep = 1,
  className,
  walletData = { signers: [], threshold: 1 },
  onCreateWallet = () => {},
  loading = false,
  isCreating = false,
  createError = null,
  createSuccess = false,
}) => {
  return (
    <div
      className={`bg-white relative rounded-lg h-full flex flex-col ${className} border border-divider justify-between`}
    >
      <div className="px-5 flex flex-col h-full justify-center gap-2 py-2">
        {/* Step Indicators */}
        <div className="flex gap-[5px] items-end justify-start">
          {/* Step 1 */}
          <div
            className={`h-8 relative rounded-[19px] w-[100px] border border-white shadow-[0px_0px_4px_0px_rgba(90,90,90,0.25)] ${
              currentStep === 1 ? "bg-[#0059ff]" : "bg-[#4CAF50]"
            }`}
          >
            <div className="absolute font-bold leading-[0] left-1/2 top-1/2 not-italic text-[20px] text-center text-white tracking-[-0.4px] translate-x-[-50%] translate-y-[-50%] w-[29.296px]">
              {currentStep === 1 ? "1" : "✓"}
            </div>
          </div>

          {/* Step 2 */}
          <div
            className={`relative rounded-[19px] w-8 h-8 border border-white shadow-[0px_0px_4px_0px_rgba(90,90,90,0.25)] ${
              currentStep >= 2 ? "bg-[#0059ff]" : "bg-[#e0e0e0] opacity-50"
            }`}
          >
            <div
              className={`absolute font-medium leading-[0] left-1/2 top-1/2 not-italic text-[16px] text-center tracking-[-0.32px] translate-x-[-50%] translate-y-[-50%] w-[29.296px] ${
                currentStep >= 2 ? "text-white" : "text-[#676767]"
              }`}
            >
              {currentStep > 2 ? "✓" : "2"}
            </div>
          </div>
        </div>

        {/* Account Info Card */}
        <div
          className="rounded-2xl w-full flex flex-col items-center justify-center relative h-[260px] gap-2 overflow-hidden"
          style={{
            background: "url(/account/new-account-placeholder-background.svg)",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="absolute inset-0 bg-black/10 backdrop-blur" />

          {/* Center Icon */}
          <div className="bg-white rounded-[39px] w-[57px] h-[57px] flex items-center justify-center relative z-10">
            <div className="overflow-hidden relative w-[57px] h-[57px] flex items-center justify-center">
              <div className="flex h-[28px] items-center justify-center w-[28px]">
                <div className="flex-none rotate-[270deg]">
                  <div className="relative w-7 h-7">
                    <svg className="w-full h-full" fill="none" viewBox="0 0 28 28">
                      <g clipPath="url(#clip0_483_7868)">
                        <g filter="url(#filter0_ii_483_7868)">
                          <path
                            d="M14.2733 4.16104C14.6997 3.9844 15.1692 3.9381 15.6219 4.02822C16.0744 4.11837 16.49 4.34059 16.8162 4.66689L24.4998 12.3505C24.9373 12.7881 25.1834 13.3822 25.1834 14.0009C25.1833 14.6194 24.9372 15.2128 24.4998 15.6503L16.8162 23.3339C16.4899 23.66 16.0744 23.8826 15.6219 23.9726C15.1695 24.0625 14.7004 24.0162 14.2743 23.8397C13.848 23.6632 13.4828 23.364 13.2264 22.9804C12.9701 22.5969 12.834 22.1457 12.8338 21.6845L12.8319 18.6659L10.4998 18.6669C10.2142 18.6668 9.93889 18.5618 9.72543 18.372C9.51189 18.1821 9.37507 17.9204 9.34164 17.6366L9.33383 17.5009V10.5009C9.33383 10.1915 9.45683 9.89448 9.67562 9.67568C9.89433 9.45705 10.1906 9.33397 10.4998 9.33389L12.8319 9.33291L12.8338 6.31729C12.8339 5.88773 12.9524 5.46593 13.1766 5.09951C13.4008 4.73317 13.722 4.43577 14.1043 4.24014L14.2733 4.16104ZM3.49984 9.33291C3.78539 9.33302 4.06082 9.43814 4.27426 9.62783C4.4878 9.81772 4.62461 10.0794 4.65804 10.3632L4.66586 10.4999V17.4999C4.66547 17.7972 4.55158 18.0835 4.3475 18.2997C4.14347 18.5156 3.86475 18.6455 3.5682 18.663C3.27146 18.6804 2.97881 18.5842 2.75082 18.3935C2.52289 18.2027 2.37587 17.9317 2.34066 17.6366L2.33285 17.4999V10.4999C2.33285 10.1905 2.45585 9.8935 2.67465 9.67471C2.89343 9.45594 3.19044 9.33291 3.49984 9.33291ZM6.99984 9.33291C7.2856 9.33295 7.56169 9.43795 7.77523 9.62783C7.98871 9.8177 8.12461 10.0794 8.15804 10.3632L8.16683 10.4999V17.4999C8.16645 17.7972 8.05255 18.0835 7.84847 18.2997C7.64436 18.5158 7.36498 18.6456 7.0682 18.663C6.7714 18.6804 6.47881 18.5843 6.25082 18.3935C6.02291 18.2027 5.87686 17.9317 5.84164 17.6366L5.83285 17.4999V10.4999C5.83285 10.1906 5.95596 9.89348 6.17465 9.67471C6.39341 9.45594 6.69047 9.33294 6.99984 9.33291Z"
                            fill="url(#paint0_linear_483_7868)"
                          />
                        </g>
                      </g>
                      <defs>
                        <linearGradient
                          gradientUnits="userSpaceOnUse"
                          id="paint0_linear_483_7868"
                          x1="14.87"
                          x2="14.87"
                          y1="3.9833"
                          y2="24.0173"
                        >
                          <stop stopColor="#003FFF" />
                          <stop offset="1" stopColor="#2864FF" />
                        </linearGradient>
                        <clipPath id="clip0_483_7868">
                          <rect fill="white" height="28" width="28" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute border border-[#0059ff] border-dashed inset-[-1px] pointer-events-none rounded-[40px]"></div>
          </div>

          {/* Account Type Label */}
          <span className="text-[#545454] text-[16px] text-center uppercase w-[292.94px] max-w-full leading-none z-10 relative mt-5">
            ACCOUNT NAME
          </span>

          {/* Account Name Display */}
          <span className="text-[#888888] text-[28px] text-center w-[292.94px] max-w-full leading-none z-10 relative">
            {accountName || "Your account name"}
          </span>
        </div>

        {/* Step Info Section */}
        <div className="bg-[#f7f7f7] rounded-xl w-full border border-[#e0e0e0] flex flex-col flex-1 h-full">
          <div className="overflow-hidden relative w-full h-full flex flex-col">
            {/* Title */}
            <div className="flex flex-col font-semibold justify-center leading-[0] p-4 not-italic text-[#545454] text-[17px] tracking-[-0.51px] uppercase w-full">
              <span className="leading-none">
                {currentStep === 1
                  ? "2. signers & confirmations"
                  : `2. SIGNERS & CONFIRMATIONS (${walletData.signers.length})`}
              </span>
            </div>

            {/* Content */}
            {currentStep === 1 ? (
              // Step 1 - Placeholder
              <div className="flex flex-col gap-[11px] items-center justify-center flex-1 w-full">
                <img src="/account/new-account-icon.svg" alt="Rocket" className="w-[105px] h-[98px]" />
                <div className="flex flex-col justify-center text-[#545454] text-[15px] text-center">
                  Setup on next step
                </div>
              </div>
            ) : (
              // Step 2+ - Display Signers Info
              <div className="flex flex-col gap-3 p-4 flex-1">
                {walletData.signers.length > 0 ? (
                  <>
                    {/* Signers List */}
                    <div className="flex flex-col gap-2">
                      {walletData.signers.map((signer, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                          <div className="flex flex-col">
                            <span className="text-[#545454] text-[14px] font-medium">
                              {signer.name || `Signer ${index + 1}`}
                            </span>
                            <span className="text-[#888888] text-[12px]">{signer.address || "No address"}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Threshold Display */}
                    <div className="mt-2 p-2 bg-blue-50 rounded border">
                      <span className="text-[#545454] text-[14px]">
                        Threshold: <strong>{walletData.threshold}</strong> of{" "}
                        <strong>{walletData.signers.length}</strong> signers required
                      </span>
                    </div>
                  </>
                ) : (
                  // No signers yet
                  <div className="flex flex-col gap-[11px] items-center justify-center flex-1 w-full">
                    <img src="/account/new-account-icon.svg" alt="Rocket" className="w-[105px] h-[98px]" />
                    <div className="flex flex-col justify-center text-[#545454] text-[15px] text-center">
                      Configure signers
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="bg-[#f7f7f7] w-full px-5 py-4 border-t border-[#e0e0e0]">
        {currentStep >= 2 && walletData.signers.length > 0 ? (
          <button
            onClick={() => {
              onCreateWallet();
            }}
            disabled={loading}
            className="bg-gradient-to-b from-[#48b3ff] to-[#0059ff] flex items-center justify-center px-5 py-2 rounded-[10px] shadow-[0px_2px_4px_-1px_rgba(12,12,106,0.5),0px_0px_0px_1px_#4470ff] w-full"
          >
            <span className="font-semibold text-[16px] text-center text-white">
              {loading ? (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              ) : (
                "Create your account"
              )}
            </span>
          </button>
        ) : (
          <button className="bg-gradient-to-b from-[#48b3ff] to-[#0059ff] flex items-center justify-center px-5 py-2 rounded-[10px] shadow-[0px_2px_4px_-1px_rgba(12,12,106,0.5),0px_0px_0px_1px_#4470ff] w-full opacity-50 cursor-not-allowed">
            <span className="font-semibold text-[16px] text-center text-white">Create your account</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default StatusContainer;
