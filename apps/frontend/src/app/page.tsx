"use client";

import { ThemeToggle } from "@/components/Common/ThemeToggle";
import { useEffect } from "react";
import { redirect } from "next/navigation";

export default function Home() {

  useEffect(() => {
    redirect('/dashboard');
  }, [])
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <header className="row-start-1 flex justify-end w-full">
        <ThemeToggle />
      </header>
    </div>
  );
}
