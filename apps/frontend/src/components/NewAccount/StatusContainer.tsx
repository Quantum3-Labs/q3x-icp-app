"use client";

import React from "react";
import { SignerData, WalletData } from "./NewAccountContainer";
import { FieldErrors } from "react-hook-form";
import { CreateAccountFormData } from "@/schemas";
import { FieldError } from "@/components/ui/field";

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
  createError?: string | null;
  isFormValid?: boolean;
  formErrors?: FieldErrors<CreateAccountFormData>;
}

const StatusContainer: React.FC<StatusContainerProps> = ({
  accountName = "Your account name",
  currentStep = 1,
  className,
  walletData = { signers: [], threshold: 1 },
  onCreateWallet = () => {},
  loading = false,
  createError = null,
  isFormValid = true,
  formErrors = {},
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
            className={`h-8 relative rounded-[19px] border border-white shadow-[0px_0px_4px_0px_rgba(90,90,90,0.25)] ${
              currentStep === 1 ? "bg-[#0059ff] w-[100px]" : "bg-[#4CAF50] w-8 h-8"
            }`}
          >
            <div className="absolute font-bold leading-[0] left-1/2 top-1/2 not-italic text-[20px] text-center text-white tracking-[-0.4px] translate-x-[-50%] translate-y-[-50%] w-[29.296px]">
              {currentStep === 1 ? "1" : "✓"}
            </div>
          </div>

          {/* Step 2 */}
          <div
            className={`relative rounded-[19px] w-8 h-8 border border-white shadow-[0px_0px_4px_0px_rgba(90,90,90,0.25)] ${
              currentStep >= 2 ? "bg-[#0059ff] w-[100px]" : "bg-[#e0e0e0] opacity-50"
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
          className="rounded-2xl w-full flex flex-col items-center justify-center relative h-[260px] gap-2 overflow-hidden opacity-90"
          style={{
            background: "url(/account/new-account-placeholder-background.svg)",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="absolute inset-0 bg-black/10" />

          {/* Center Icon */}
          <img src="/account/new-account-arrow.svg" alt="Account detail" className="w-20 h-20 mt-20" />

          {/* Account Type Label */}
          <span className="text-[#545454] text-[16px] text-center uppercase w-[292.94px] max-w-full leading-none z-10 relative mt-1">
            ACCOUNT NAME
          </span>

          {/* Account Name Display */}
          <span className={`text-[28px] text-center w-[292.94px] max-w-full leading-none z-10 relative ${
            formErrors.accountName ? "text-red-400" : "text-[#ffffff]"
          }`}>
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
                        <div key={index} className={`flex items-center justify-between p-2 rounded border ${
                          formErrors.signers?.[index] ? "bg-red-50 border-red-300" : "bg-white"
                        }`}>
                          <div className="flex flex-col flex-1">
                            <span className="text-[#545454] text-[14px] font-medium">
                              {`Signer ${index + 1}`}
                              {index === 0 && <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">You</span>}
                            </span>
                            <span className="text-[#888888] text-[12px] font-mono">
                              {signer.address ? 
                                `${signer.address.slice(0, 8)}...${signer.address.slice(-8)}` : 
                                "No address"
                              }
                            </span>
                            {/* Signer Error */}
                            {formErrors.signers?.[index]?.address && (
                              <FieldError errors={[formErrors.signers[index].address]} className="mt-1" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* General Signers Error */}
                    {formErrors.signers && typeof formErrors.signers.message === 'string' && (
                      <FieldError errors={[{ message: formErrors.signers.message }]} />
                    )}

                    {/* Threshold Display */}
                    <div className={`mt-2 p-2 rounded border ${
                      formErrors.threshold ? "bg-red-50 border-red-300" : "bg-blue-50"
                    }`}>
                      <span className="text-[#545454] text-[14px]">
                        Threshold: <strong>{walletData.threshold}</strong> of{" "}
                        <strong>{walletData.signers.length}</strong> signers required
                      </span>
                      {/* Threshold Error */}
                      {formErrors.threshold && (
                        <FieldError errors={[formErrors.threshold]} className="mt-1" />
                      )}
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

        {/* Create Error Display */}
        {createError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-red-700">
              <span className="text-sm font-medium">⚠️ Creation Failed</span>
            </div>
            <div className="text-sm text-red-600 mt-1">{createError}</div>
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="bg-[#f7f7f7] w-full px-5 py-4 border-t border-[#e0e0e0]">
        {currentStep >= 2 && walletData.signers.length > 0 ? (
          <button
            onClick={() => {
              onCreateWallet();
            }}
            disabled={loading || !isFormValid}
            className={`flex items-center justify-center px-5 py-2 rounded-[10px] shadow-[0px_2px_4px_-1px_rgba(12,12,106,0.5),0px_0px_0px_1px_#4470ff] w-full ${
              loading || !isFormValid 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-gradient-to-b from-[#48b3ff] to-[#0059ff]"
            }`}
          >
            <span className="font-semibold text-[16px] text-center text-white cursor-pointer">
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
