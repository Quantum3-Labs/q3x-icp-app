"use client";

import { CreateAccountFormData } from "@/schemas";
import React, { useState } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import { Field, FieldDescription, FieldError, FieldGroup } from "../ui/field";
import { InputGroup, InputGroupAddon, InputGroupText } from "../ui/input-group";
import { Input } from "../ui/input";

interface AccountProps {
  className?: string;
  form: UseFormReturn<CreateAccountFormData>;
  onNextStep: () => void;
  isValid?: boolean;
}

export default function Account({ className, form, onNextStep, isValid = false }: AccountProps) {
  const handleNextClick = () => {
    if (isValid) {
      onNextStep();
    }
  };

  return (
    <div
      className={`overflow-hidden relative w-full h-full flex flex-col rounded-lg bg-background ${className} border border-divider`}
    >
      {/* Earth background images */}
      <div className="w-full relative">
        <div className="absolute top-0 flex h-[736.674px] items-center justify-center left-1/2 translate-x-[-50%] w-[780px] pointer-events-none">
          <img src="/send/top-globe.svg" alt="Bottom globe" className="w-full h-full" />
        </div>
        <div className="absolute top-10 left-0 right-0 h-[400px] w-full bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
      </div>

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

        {/* Basic setup */}
        <div className="flex items-center justify-center w-full max-w-2xl flex-col text-center">
          <span className="text-text-primary uppercase text-[26px] font-bold">1. Basic setup</span>
          <span className="text-text-secondary text-[16px]">
            This is the basic setup of the account, please enter the account name in the box below.
          </span>
          <span className="text-text-secondary text-[16px]">
            Or click the generate button next to it to automatically generate the account name.
          </span>
        </div>

        {/* Address input */}
        <FieldGroup>
          <Controller
            name="accountName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <div className="flex gap-2.5 items-center justify-center w-full">
                  <InputGroup
                    className={`bg-white grow min-h-px min-w-px relative rounded-[16px] border shadow-[0px_0px_10.3px_0px_rgba(135,151,255,0.14),0px_0px_89.5px_0px_rgba(0,0,0,0.05)] ${
                      fieldState.invalid ? "border-red-500" : "border-[#e0e0e0]"
                    }`}
                  >
                    <Input
                      {...field}
                      id="account-name-input"
                      placeholder="Your account name"
                      className="text-text-secondary text-[16px] outline-none placeholder:text-text-secondary flex-3 border-none bg-transparent p-3"
                      style={{
                        clipPath: "inset(0 56px 0 0)",
                        textOverflow: "ellipsis",
                        boxShadow: "none !important",
                        outline: "none !important",
                      }}
                      aria-invalid={fieldState.invalid}
                      autoComplete="off"
                    />
                    <InputGroupAddon align="block-end" className="!pb-0 -mt-1">
                      <InputGroupText
                        className={`absolute right-2 top-1/2 transform -translate-y-1/2 text-[13px] tabular-nums ${
                          (field.value?.length || 0) > 30 ? "text-red-400" : "text-gray-400"
                        }`}
                      >
                        {field.value?.length || 0}/30
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>

                  <img
                    src="/swap/swap-icon.svg"
                    alt="Generate name"
                    className="w-5 h-5 cursor-pointer"
                    data-tooltip-id="generate-name-tooltip"
                  />
                </div>
                {/* Auto error display */}
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>
        {/* Action buttons */}
        <div className="flex gap-2 items-center justify-center w-full max-w-xs">
          <button
            onClick={handleNextClick}
            disabled={!isValid}
            className={`flex items-center justify-center px-5 py-2 rounded-[10px] shadow-[0px_2px_4px_-1px_rgba(12,12,106,0.5),0px_0px_0px_1px_#4470ff] cursor-pointer ${
              isValid ? "bg-gradient-to-b from-[#48b3ff] to-[#0059ff]" : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            <span className="font-semibold text-[16px] text-center text-white tracking-[-0.16px]">Next Step</span>
          </button>
        </div>
      </div>
    </div>
  );
}
