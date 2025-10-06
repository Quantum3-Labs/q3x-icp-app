"use client";

import React from "react";

interface AddressCardProps {
  contact: {
    name: string;
    address: string;
    company: string;
  };
  onRequest?: () => void;
  onSendTokens?: () => void;
  onEdit?: () => void;
  className?: string;
}

export default function AddressCard({ contact, onRequest, onSendTokens, onEdit, className }: AddressCardProps) {
  return (
    <div className={`bg-white relative rounded-lg w-full h-full ${className} border border-primary`}>
      <div className="overflow-hidden relative w-full h-full rounded-t-lg">
        {/* Gradient background */}
        <div className="absolute bg-gradient-to-b from-primary to-white h-1/2 left-0 top-0 w-full rounded-t-lg" />

        {/* Black divider line */}
        <div className="absolute bg-black h-1/2 left-1/2 top-[-22.57px] translate-x-[-50%] w-[16.425px] flex flex-col items-center justify-center gap-15">
          {Array.from({ length: 7 }, (_, index) => (
            <div key={index} className="flex items-center justify-center">
              <span className="rotate-[270deg] font-medium text-xs text-white">{contact.company}</span>
            </div>
          ))}
        </div>

        {/* Edit button */}
        <button
          onClick={onEdit}
          className="absolute bg-gradient-to-b from-[#9c9c9c] to-[#303030] flex items-center justify-center px-5 py-1.5 right-2.5 top-2.5 rounded-[10px] shadow-[0px_2px_4px_-1px_rgba(131,131,131,0.5),0px_0px_0px_1px_#a1a1a1]"
        >
          <span className="font-medium text-sm text-white">Edit</span>
        </button>

        {/* Contact card */}
        <div className="absolute bg-[#0059ff] h-[310px] left-1/2 rounded-[18px] top-1/2 translate-x-[-50%] translate-y-[-50%] w-[240px] border-2 border-black">
          <div className="relative rounded-[18px] w-full h-full">
            <div className="overflow-hidden relative w-full h-full">
              {/* Company badge */}
              <div className="absolute bg-white flex items-center justify-start px-4 py-[7px] right-2.5 top-2.5 rounded-[20px]">
                <span className="font-medium text-sm text-[#0059ff] leading-none">{contact.company}</span>
              </div>

              <img src="/address-book/default-avatar.svg" alt="Address card background" className="w-full h-full" />

              {/* Contact info at bottom */}
              <div className="absolute bottom-0 left-0 right-0 pb-4 pt-0 px-3">
                <div className="flex flex-col gap-1.5 items-start">
                  <div className="text-2xl text-white leading-none">{contact.name}</div>
                  <button className="bg-white flex items-center justify-center px-1.5 py-[5px] rounded-[34px]">
                    <span className="font-medium text-xs text-[#0059ff]">{contact.address}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons at bottom */}
        <div className="absolute bg-[#f7f7f7] bottom-0 left-0 right-0 pl-5 pr-4 py-4 border-t border-divider rounded-b-lg">
          <div className="flex gap-2 items-center">
            <button
              onClick={onRequest}
              className="bg-gradient-to-b from-[#e6a7ff] to-[#c43ef7] flex items-center justify-center px-5 py-2 rounded-[10px] shadow-[0px_2px_4px_-1px_rgba(231,113,255,0.5),0px_0px_0px_1px_#ed66ff] flex-1"
            >
              <span className="font-semibold text-base text-white">Request</span>
            </button>
            <button
              onClick={onSendTokens}
              className="bg-gradient-to-b from-[#48b3ff] to-[#0059ff] flex items-center justify-center px-5 py-2 rounded-[10px] shadow-[0px_2px_4px_-1px_rgba(12,12,106,0.5),0px_0px_0px_1px_#4470ff] flex-1"
            >
              <span className="font-semibold text-base text-white">Send tokens</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
