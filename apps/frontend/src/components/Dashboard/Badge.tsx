"use client";

import React from "react";

interface BadgeProps {
  status: "success" | "failed";
}

function Badge({ status }: BadgeProps) {
  const baseClasses =
    "box-border content-stretch flex gap-1 items-center justify-center pb-1 pt-[3px] px-[7px] relative rounded-[6px] size-full";

  if (status === "failed") {
    return (
      <div className={`${baseClasses} bg-gradient-to-b from-[#ffebeb] to-[#ffd1d2]`}>
        <div
          aria-hidden="true"
          className="absolute border-[1.5px] border-[rgba(255,40,40,0.15)] border-solid inset-[-0.75px] pointer-events-none rounded-[6.75px]"
        />
        <div
          className="bg-clip-text bg-gradient-to-b flex flex-col from-[#ff2828] justify-center relative shrink-0 text-[13px] text-nowrap to-[#A31E1E] font-bold"
          style={{ WebkitTextFillColor: "transparent" }}
        >
          <p className="leading-[1.1] whitespace-pre">Failed</p>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className={`${baseClasses} bg-gradient-to-b from-[#effff2] to-[#b8ffc2]`}>
        <div
          aria-hidden="true"
          className="absolute border-[1.5px] border-[rgba(21,135,100,0.16)] border-solid inset-[-0.75px] pointer-events-none rounded-[6.75px]"
        />
        <div
          className="bg-clip-text bg-gradient-to-b flex flex-col from-[#00af13] justify-center relative shrink-0 text-[13px] text-nowrap to-[#004908] font-bold"
          style={{ WebkitTextFillColor: "transparent" }}
        >
          <p className="leading-[1.1] whitespace-pre">Succeed</p>
        </div>
      </div>
    );
  }
}

export default Badge;
