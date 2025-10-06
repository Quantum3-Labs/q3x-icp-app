"use client";
import React from "react";
import Sidebar from "./Common/Sidebar";
import Title from "./Common/Title";
import { useMobileDetection } from "@/hooks/useMobileDetection";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  useMobileDetection();

  return (
    <div className="flex flex-row gap-2 pr-2">
      <Sidebar />
      <div className="flex flex-col gap-2 w-full">
        <Title />
        <div className="flex flex-col w-full h-[94%] bg-background rounded-lg">{children}</div>
      </div>
    </div>
  );
}
