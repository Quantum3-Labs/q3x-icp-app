"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Copy, Trash2 } from "lucide-react";
import { copyAddressToClipboard } from "@/utils/helper";

interface SignerListModalProps {
  children: React.ReactNode;
  signers?: string[];
}

export const SignerListModal: React.FC<SignerListModalProps> = ({ children, signers = [] }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] p-0">
        <DialogTitle hidden></DialogTitle>
        <div className="flex flex-col h-full bg-white rounded-lg">
          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 pt-3 space-y-6">
            {/* Account Signers Section */}
            <div>
              <h3 className="font-semibold text-gray-900">ACCOUNT SIGNERS</h3>
              <p className="text-sm text-gray-500 mb-4">
                Addresses added to the signers list below will play an important role in approving future transactions
                as team members.
              </p>

              {/* Existing Signers */}
              <div className="space-y-3 mb-4">
                {signers.map((signer, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded">
                    <span className="font-mono text-sm text-gray-900 w-[500px] truncate">{signer}</span>
                    <div className="flex items-center gap-2 ">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyAddressToClipboard(signer)}
                        className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600 cursor-pointer"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
