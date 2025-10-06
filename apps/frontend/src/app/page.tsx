import Image from "next/image";
import { ThemeToggle } from "@/components/Common/ThemeToggle";
import InternetIdentityConnect from "@/components/NewAccount/InternetIdentityConnect";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <header className="row-start-1 flex justify-end w-full">
        <ThemeToggle />
      </header>
      <div className="space-y-6">
        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold mb-4">ICP Wallet Creation</h2>
          <InternetIdentityConnect />
        </div>
      </div>
    </div>
  );
}
