"use client";
import React from "react";

const InfoCardContainer = () => {
  return (
    <div className="flex gap-2 h-full w-[600px]">
      {/* Account Card */}
      <div className="flex-1 bg-surface-light rounded-lg p-3 pt-2 flex flex-col justify-between">
        <div className="flex items-center justify-between w-full">
          <span className="text-text-secondary text-[15px] capitalize ">Account</span>
          <img src="/misc/reset-icon.svg" alt="arrow-right" className="w-4 h-4" />
        </div>
        <span className="text-text-primary text-[20px] tracking-[-0.2px] w-full">
          <span>ICP [</span>
          <span className="text-primary">Default</span>
          <span>]</span>
        </span>
      </div>

      {/* Signers List Card */}
      <div className="flex-1 bg-surface-light rounded-lg p-3 pt-2 flex flex-col justify-between">
        <div className="flex items-center justify-between w-full ">
          <span className="text-text-secondary text-[15px] capitalize">Signers list</span>
          <span className="text-primary text-[16px] tracking-[-0.16px] cursor-pointer">See all</span>
        </div>
        <span className="text-text-primary text-[20px] tracking-[-0.2px] ">05</span>
      </div>
    </div>
  );
};

export default InfoCardContainer;
