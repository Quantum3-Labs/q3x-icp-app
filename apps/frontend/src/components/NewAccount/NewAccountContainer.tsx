"use client";

import React, { useState } from "react";
import Account from "./Account";
import StatusContainer from "./StatusContainer";
import SignersConfirmations from "./SignersConfirmations";
import { Principal } from "@dfinity/principal";
import { getAccountAddressFromPrincipal } from "@/utils/helper";
import SuccessScreen from "../Account/SuccessScreen";
import { useCreateWallet } from "@/hooks/api/useWallets";
import { useCanisterStore, useWalletStore } from "@/store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateAccountFormData, createAccountSchema } from "@/schemas";
import { toast } from "sonner";
import { Wallet } from "@q3x/models";

// export type SignerData = Array<{ name: string; address: string }>;
export type SignerData = Array<{ address: string }>;

export interface WalletData {
  signers: SignerData;
  threshold: number;
}
export default function NewAccountContainer() {
  const [currentStep, setCurrentStep] = useState(1);

  const [createError, setCreateError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { setActor } = useCanisterStore();
  const { setCurrentWallet } = useWalletStore();

  const { mutateAsync: createWalletMutation } = useCreateWallet();

  const form = useForm<CreateAccountFormData>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: {
      accountName: "",
      signers: [{ address: "" }],
      threshold: 1,
    },
    mode: "onChange"
  });

  const {
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = form;

  const formData = watch();

  const handleCreateWallet = async (data: CreateAccountFormData) => {
    try {
      setCreateError(null);
      setLoading(true);

      // Convert string addresses to Principal
      const signerPrincipals = data.signers.map(s => Principal.fromText(s.address.trim()));
      const creatorPrincipal = data.signers[0].address;

      // Step 1: Call backend to deploy canister
      const backendResponse = await createWalletMutation({
        name: data.accountName,
        signers: data.signers.map(s => s.address), // Principal strings
        creatorPrincipal: creatorPrincipal,
      });

      // Step 2: Initialize actor with new canister ID
      const newActor = await setActor(backendResponse.data.canisterId);

      // Step 3: Call canister create_wallet
      const result = await newActor.create_wallet(
        data.accountName, // wallet_id: string
        signerPrincipals, // signers: Principal[]
        data.threshold, // threshold: number
      );
      console.log("Create wallet result:", result);

      // Handle Result type
      if ("Ok" in result) {
        const walletCreated = new Wallet(
          {
            canisterId: backendResponse.data.canisterId,
            name: data.accountName,
          },
        );
        setCurrentWallet(walletCreated);
        console.log("Wallet created successfully");
        toast.success("Wallet created successfully");
        setCurrentStep(3); // move to final step
        setLoading(false);
      } else {
        setCreateError(result.Err);
      }
    } catch (err) {
      console.log("Failed to create wallet:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = () => {
    const accountNameError = errors.accountName;
    if (!accountNameError && formData.accountName?.trim()) {
      setCurrentStep(2);
    }
  };

  const handleGoBack = () => {
    setCurrentStep(1);
  };

  const isStep1Valid = !!(!errors.accountName && formData.accountName?.trim());
  const isStep2Valid =
    !errors.signers && !errors.threshold && formData.signers?.some(s => s.address.trim()) && formData.threshold >= 1;

  if (currentStep === 3) {
    return (
      <div className="flex flex-row gap-1 w-full h-full bg-app-background">
        <SuccessScreen className="w-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-row gap-1 w-full h-full bg-app-background">
      {currentStep === 1 ? (
        <Account className="flex-1" form={form} onNextStep={handleNextStep} isValid={isStep1Valid} />
      ) : (
        <SignersConfirmations onGoBack={handleGoBack} form={form} isValid={isStep2Valid} />
      )}

      <StatusContainer
        className="w-[400px]"
        accountName={formData.accountName || "Your account name"}
        currentStep={currentStep}
        walletData={{
          signers: formData.signers?.filter(s => s.address.trim()) || [],
          threshold: formData.threshold || 1,
        }}
        onCreateWallet={handleSubmit(handleCreateWallet)}
        loading={loading}
        isFormValid={isValid}
        formErrors={errors}
        createError={createError}
      />
    </div>
  );
}
