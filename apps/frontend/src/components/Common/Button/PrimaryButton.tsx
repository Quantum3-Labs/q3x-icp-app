"use client";

import React from "react";

export default function PrimaryButton({ text, onClick }: { text: string, onClick: () => void }) {
  return <button className="bg-gradient-to-b from-[#48b3ff] to-[#0059ff] flex items-center justify-center px-5 py-2 rounded-[10px] shadow-[0px_2px_4px_-1px_rgba(12,12,106,0.5),0px_0px_0px_1px_#4470ff] cursor-pointer" onClick={onClick}>
  <span className="font-semibold text-[16px] text-center text-white">{text}</span>
</button>;
}