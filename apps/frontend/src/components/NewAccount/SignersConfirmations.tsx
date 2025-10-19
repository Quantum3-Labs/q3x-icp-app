"use client";

import React, { useCallback, useEffect } from "react";
import { useAuthStore } from "@/store/auth";
import { CreateAccountFormData } from "@/schemas";
import { UseFormReturn, Controller, useFieldArray } from "react-hook-form";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { debounce } from "lodash";

interface SignersConfirmationsProps {
  onGoBack: () => void;
  form: UseFormReturn<CreateAccountFormData>;
  isValid: boolean;
}

const SignersConfirmations: React.FC<SignersConfirmationsProps> = ({ onGoBack, form, isValid }) => {
  const { principal } = useAuthStore();

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "signers",
  });
  // console.log("🚀 ~ SignersConfirmations ~ fields:", fields);
  console.log(form.formState.errors.signers)

  const watchedSigners = form.watch("signers");
  const watchedThreshold = form.watch("threshold");

  // Set principal when available
  useEffect(() => {
    if (principal) {
      form.setValue("signers.0.address", principal);
    }
  }, [principal]);

  const handleAddSigner = () => {
    append({ address: "" });
  };

  const handleRemoveSigner = (index: number) => {
    if (fields.length > 1) {
      remove(index);
      // Adjust threshold if needed
      if (watchedThreshold > fields.length - 1) {
        form.setValue("threshold", fields.length - 1);
      }
    }
  };

  const debouncedValidation = useCallback(
    debounce(() => {
      form.trigger("signers");
    }, 100),
    [form],
  );

  const handleSignerChange = (index: number, value: string) => {
    form.setValue(`signers.${index}.address`, value.trim());
    debouncedValidation();
  };

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

        {/* Form */}
        <form id="signers-form" className="w-full max-w-2xl">
          <FieldGroup>
            {/* Account Signers Section */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <span className="text-text-primary uppercase text-[16px] font-bold">ACCOUNT SIGNERS</span>
                <span className="text-text-secondary text-[14px]">
                  Addresses added to the signers list below will play an important role in approving future transactions
                  as team members.
                </span>
              </div>

              {/* Signers List */}
              <div className="flex flex-col gap-3">
                {fields.map((field, index) => (
                  <Controller
                    key={field.id}
                    name={`signers.${index}.address`}
                    control={form.control}
                    render={({ field: inputField, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <div className="flex gap-2 items-center">
                          <Input
                            {...inputField}
                            onChange={e => handleSignerChange(index, e.target.value.trim())}
                            placeholder={index === 0 ? "Your principal (current user)" : "Signer principal"}
                            disabled={index === 0} // First signer is current user
                            className={`flex-1 p-3 bg-white border rounded-[16px] text-[16px] outline-none shadow-none ${
                              fieldState.invalid
                                ? "border-red-500 bg-red-50"
                                : index === 0
                                ? "bg-gray-100 border-gray-300"
                                : "border-none"
                            }`}
                            // style={{
                            //   boxShadow: "none !important",
                            //   outline: "none !important"
                            // }}
                            aria-invalid={fieldState.invalid}
                          />

                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveSigner(index)}
                            disabled={fields.length <= 1 || index === 0} // Can't remove first signer
                            className="w-8 h-8 p-0 text-gray-400 hover:text-red-500"
                          >
                            🗑️
                          </Button>
                        </div>

                        {(fieldState.error || form.formState.errors.signers) && index !== 0 && (
                          <FieldError errors={[fieldState.error || form.formState.errors.signers]} />
                        )}
                      </Field>
                    )}
                  />
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddSigner}
                  className="bg-gray-100 border border-dashed border-gray-300 rounded-[16px] p-3 text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  + Add New Signer
                </Button>
              </div>
            </div>

            {/* Threshold Section */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <span className="text-text-primary uppercase text-[16px] font-bold">THRESHOLD</span>
                <span className="text-text-secondary text-[14px]">
                  This is the minimum number of confirmations required for a transaction to go through.
                </span>
              </div>

              <Controller
                name="threshold"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <div className="flex items-center gap-2">
                      <Input
                        {...field}
                        type="number"
                        min="1"
                        max={fields.length}
                        onChange={e => field.onChange(Number(e.target.value))}
                        className={`w-20 p-3 bg-white border rounded-[16px] text-[16px] outline-none text-center ${
                          fieldState.invalid ? "border-red-500 bg-red-50" : "border-[#e0e0e0]"
                        }`}
                        aria-invalid={fieldState.invalid}
                      />
                      <span className="text-text-secondary text-[16px]">out of {fields.length} signers</span>
                    </div>

                    <FieldDescription>
                      Anyone on the list can approve transactions as long as the minimum number of approvals is met.
                    </FieldDescription>

                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>
          </FieldGroup>
        </form>

        {/* Action buttons */}
        <div className="flex gap-4 items-center justify-center w-full max-w-xs">
          <Button
            type="button"
            variant="secondary"
            onClick={onGoBack}
            className="bg-gray-500 hover:bg-gray-600 flex items-center justify-center px-5 py-2 rounded-[10px] transition-colors"
          >
            <span className="font-semibold text-[16px] text-center text-white cursor-pointer">Go Back</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SignersConfirmations;
