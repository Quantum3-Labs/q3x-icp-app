"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";
import { copyAddressToClipboard } from "@/utils/helper";
import { DialogOverlay, DialogPortal } from "@radix-ui/react-dialog";

interface ReceiveModalProps {
  children: React.ReactNode;
  address: string;
  symbol: string;
  // Controlled mode (external state)
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const ReceiveModal: React.FC<ReceiveModalProps> = ({ 
  children, 
  address, 
  symbol = "icp", 
  open,
  onOpenChange 
}) => {
  // Internal state for uncontrolled mode
  const [internalOpen, setInternalOpen] = useState(false);
  
  // Determine if controlled or uncontrolled
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  const setIsOpen = isControlled ? (onOpenChange || (() => {})) : setInternalOpen;

  const handleOpenModal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(true);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <div onClick={handleOpenModal} className="contents">
        {children}
      </div>

      <DialogPortal container={document.body}>
        <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[999]" />
        <DialogContent className="sm:max-w-md bg-white border-0 shadow-2xl z-[1000]">
          <div className="flex flex-col p-5 pb-0">
            {/* Header */}
            <DialogHeader className="w-full mb-3">
              <div className="flex items-center justify-center">
                <DialogTitle className="text-3xl font-semibold text-gray-900">
                  Receive {symbol.toUpperCase()}
                </DialogTitle>
              </div>
            </DialogHeader>

            {/* QR Code */}
            <div
              className="mb-4 p-4 flex justify-center bg-white rounded-2xl border-2 border-gray-100 shadow-sm cursor-pointer"
              onClick={() => copyAddressToClipboard(address)}
            >
              <QRCodeSVG
                value={address}
                size={280}
                bgColor="#ffffff"
                fgColor="#000000"
                level="H"
                imageSettings={{
                  src: `/token/${symbol.toLowerCase()}.svg`,
                  width: 64,
                  height: 64,
                  excavate: true,
                }}
              />
            </div>

            {/* Address Section */}
            <div className="w-full space-y-3">
              <div className="text-sm font-medium text-gray-700">
                {symbol.toUpperCase()} Address
              </div>
              <div className="flex items-center justify-between gap-2 p-3 bg-gray-50 rounded-lg border cursor-pointer">
                <div
                  className="flex-1 font-mono text-sm text-gray-900 break-all"
                  onClick={() => copyAddressToClipboard(address)}
                >
                  {address}
                </div>
              </div>
            </div>

            {/* Finish Button */}
            <Button 
              className="w-full mt-6 bg-gradient-to-r from-[#48b3ff] to-[#0059ff] cursor-pointer"
              onClick={() => setIsOpen(false)}
            >
              Finish
            </Button>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};
