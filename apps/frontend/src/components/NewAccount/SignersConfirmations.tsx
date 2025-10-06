"use client";

import React, { useEffect, useState } from "react";
import { SignerData } from "./NewAccountContainer";
import { useAuthStore } from "@/store/auth";

interface SignersConfirmationsProps {
  onGoBack: () => void;
  handleWalletData: (data: { signers: SignerData; threshold: number }) => void;
  initialSigners?: SignerData;
  initialThreshold?: number;
}

const SignersConfirmations: React.FC<SignersConfirmationsProps> = ({
  onGoBack,
  handleWalletData,
  initialSigners = [],
  initialThreshold = 1,
}) => {
  const {principal } = useAuthStore();
  const [signers, setSigners] = useState<SignerData>(initialSigners);
  const [threshold, setThreshold] = useState(initialThreshold);
  const [duplicateErrors, setDuplicateErrors] = useState<boolean[]>([]);

  const isValid = threshold >= 1 && threshold <= signers.length;

  const handleAddSigner = () => {
    setSigners([...signers, { name: "", address: "" }]);
  };

  const handleSignerChange = (index: number, field: "name" | "address", value: string) => {
    const newSigners = [...signers];
    newSigners[index][field] = value;
    setSigners(newSigners);

    // check duplicate
    if (field === "address" && value.trim()) {
      const isDuplicate = newSigners.some((signer, i) => i !== index && signer.address.trim() === value.trim());

      if (isDuplicate) {
        const newErrors = [...duplicateErrors];
        const isDuplicate = newSigners.some(
          (signer, i) => i !== index && signer.address.trim() === value.trim() && value.trim() !== "",
        );
        newErrors[index] = isDuplicate;
        setDuplicateErrors(newErrors);
      }
    }
  };

  const handleRemoveSigner = (index: number) => {
    if (signers.length > 1) {
      setSigners(signers.filter((_, i) => i !== index));
      if (threshold > signers.length - 1) {
        setThreshold(signers.length - 1);
      }
    }
  };

  const handleChangeSignerPrincipal = () => {
    // Get all non-empty addresses
    const addresses = signers.map(s => s.address.trim()).filter(addr => addr !== "");

    // Check for duplicates
    const hasDuplicates = addresses.some((address, index) => addresses.indexOf(address) !== index);

    if (hasDuplicates) {
      alert("Please remove duplicate signer addresses before proceeding.");
      return;
    }

    if (isValid) {
      handleWalletData({ signers: signers.filter(s => s.address.trim()), threshold });
    }
  };

  useEffect(() => {
    if (principal) {
      setSigners([
        { name: "", address: principal },
        { name: "", address: "" },
      ]);
      handleChangeSignerPrincipal();
    }
  }, [principal]);

  return (
    <div className="overflow-hidden relative w-full h-full flex flex-col rounded-lg bg-background border border-divider">
      {/* Main content */}
      <div className="flex flex-col gap-[20px] items-center justify-center flex-1 px-4 relative z-10">
        {/* Title section */}
        <div className="flex flex-col items-center justify-center pb-8">
          <div className="text-[#545454] text-6xl text-center font-bold uppercase w-full">create new</div>
          <div className="flex gap-[5px] items-center justify-center w-full">
            <div className="text-[#545454] text-6xl text-center font-bold uppercase">acc</div>
            <div className="h-[48px] relative rounded-full w-[125.07px] border-[4.648px] border-primary border-solid"></div>
            <div className="text-[#545454] text-6xl text-center font-bold uppercase">unt</div>
          </div>
        </div>

        {/* Step 2 header */}
        <div className="flex items-center justify-center w-full max-w-2xl flex-col text-center">
          <span className="text-text-primary uppercase text-[26px] font-bold">2. SIGNERS & CONFIRMATIONS</span>
        </div>

        {/* Account Signers Section */}
        <div className="flex flex-col gap-4 w-full max-w-2xl">
          <div className="flex flex-col gap-2">
            <span className="text-text-primary uppercase text-[16px] font-bold">ACCOUNT SIGNERS</span>
            <span className="text-text-secondary text-[14px]">
              Addresses added to the signers list below will play an important role in approving future transactions as
              team members.
            </span>
          </div>

          {/* Signers List */}
          <div className="flex flex-col gap-3">
            {signers.map((signer, index) => (
              <div key={index} className="flex gap-2 items-center">
                {index === 0 ? (
                  <>
                    <input
                      type="text"
                      value={principal || ""}
                      disabled={true}
                      className="flex-1 p-3 bg-white border border-[#e0e0e0] rounded-[16px] text-[16px] outline-none"
                    />
                    <button
                      onClick={() => handleRemoveSigner(index)}
                      className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500"
                      disabled={signers.length <= 1}
                    >
                      🗑️
                    </button>{" "}
                  </>
                ) : (
                  <>
                    <input
                      type="text"
                      placeholder="Signer principal"
                      value={signer.address}
                      onChange={e => {
                        handleSignerChange(index, "address", e.target.value);
                        handleChangeSignerPrincipal();
                      }}
                      className={`flex-1 p-3 bg-white border rounded-[16px] text-[16px] outline-none ${
                        duplicateErrors[index] ? "border-red-500 bg-red-50" : "border-[#e0e0e0]"
                      }`}
                    />
                    <button
                      onClick={() => handleRemoveSigner(index)}
                      className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500"
                      disabled={signers.length <= 1}
                    >
                      🗑️
                    </button>{" "}
                  </>
                )}
              </div>
            ))}

            <button
              onClick={handleAddSigner}
              className="bg-gray-100 border border-dashed border-gray-300 rounded-[16px] p-3 text-gray-600 hover:bg-gray-200 transition-colors"
            >
              New Signer
            </button>
          </div>
        </div>

        {/* Threshold Section */}
        <div className="flex flex-col gap-4 w-full max-w-2xl">
          <div className="flex flex-col gap-2">
            <span className="text-text-primary uppercase text-[16px] font-bold">THRESHOLD</span>
            <span className="text-text-secondary text-[14px]">
              This is the minimum number of confirmations required for a transaction to go through. Anyone on the list
              can approve the transaction as long as the minimum number of approvals is met.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              max={signers.length}
              value={threshold}
              onChange={e => {
                const value = Number(e.target.value);
                setThreshold(value);
                handleWalletData({ signers: signers.filter(s => s.address.trim()), threshold: value });
              }}
              className="w-20 p-3 bg-white border border-[#e0e0e0] rounded-[16px] text-[16px] outline-none text-center"
            />
            <span className="text-text-secondary text-[16px]">/out of {signers.length} signers</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-4 items-center justify-center w-full max-w-xs">
          <button
            onClick={onGoBack}
            className="bg-gray-500 hover:bg-gray-600 flex items-center justify-center px-5 py-2 rounded-[10px] transition-colors"
          >
            <span className="font-semibold text-[16px] text-center text-white">Go back</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignersConfirmations;
