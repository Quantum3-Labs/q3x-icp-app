"use client";

import React, { useEffect } from "react";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { X, Send, ArrowDown, ArrowLeftRight, ArrowUp } from "lucide-react";
import { usePortfolio } from "@/hooks/api/usePortfolio";
import { Token } from "@q3x/models";
import { buildAvailableTokens } from "@/utils/helper";
import { ClipLoader } from "react-spinners";
import { Skeleton } from "../ui/skeleton";
import { useRouter } from "next/navigation";
import { useWalletStore } from "@/store";

interface PortfolioModalProps {
  children: React.ReactNode;
}

export const PortfolioModal: React.FC<PortfolioModalProps> = ({ children }) => {
  const router = useRouter();
  const { getCurrentNetwork } = useWalletStore();
  console.log("🚀 ~ PortfolioModal ~ getCurrentNetwork:", getCurrentNetwork());
  const { data: portfolio, isLoading, error } = usePortfolio();

  const [tokenData, setTokenData] = React.useState<Token[]>([]);
  const [showBalance, setShowBalance] = React.useState(true);

  const toggleShowBalance = () => {
    setShowBalance(!showBalance);
  };

  const avatarSkeleton = (index: number) => {
    return (
      <div className="flex items-center space-x-4 " key={index}>
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (portfolio) {
      const tokens = buildAvailableTokens(portfolio, getCurrentNetwork()?.name);
      setTokenData(tokens);
    }
  }, [portfolio, getCurrentNetwork()?.name]);
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetTitle></SheetTitle>
      <SheetContent side="right" className="w-[386px] h-[90%] p-0 border-l-0 top-[50px] right-[10px] rounded-lg">
        <div className="flex flex-col h-full">
          {/* Header with Balance Card */}
          <div className="relative bg-[#0059FF] bg-[url('/portfolio/background-circle.svg')] bg-no-repeat bg-right rounded-lg">
            {/* Blue gradient background */}
            <div className="px-4 pt-4 pb-6 text-white relative overflow-hidden ">
              {/* Close button */}
              <div className="flex flex-column justify-between items-start mb-4 relative z-10 gap-1">
                <div className="text-sm font-medium flex gap-2 items-center">
                  <span>Wallet balance</span>{" "}
                  <img
                    src="/portfolio/eye.svg"
                    width={16}
                    height={16}
                    className="cursor-pointer"
                    onClick={toggleShowBalance}
                  />
                </div>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h8 w-8 p-4 text-black bg-white hover:bg-white/70 cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
              </div>

              {/* Balance */}
              <div className="relative z-10 mb-3">
                <div className="text-3xl">
                  {getCurrentNetwork()?.name}{" "}
                  <span className="font-bold">
                    {isLoading ? (
                      <Skeleton className=" h-5 w-[100px] inline-block" />
                    ) : showBalance ? (
                      tokenData[0]?.balance ?? "0.00"
                      // portfolio?.icp_balance?.balance_icp ?? "0.00"
                    ) : (
                      "*****"
                    )}
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 relative z-10">
                <SheetClose asChild>
                  <Button
                    size="lg"
                    className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm flex items-center gap-1 cursor-pointer"
                    onClick={() => router.push("/send")}
                  >
                    <img src={"/arrow/thin-arrow-up.svg"} className="brightness-0 invert" />
                    Send
                  </Button>
                </SheetClose>
                {/* <Button
                  size="sm"
                  className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm flex items-center gap-1"
                >
                  <ArrowDown className="h-3 w-3" />
                  Receive
                </Button>
                <Button
                  size="sm"
                  className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm flex items-center gap-1"
                >
                  <ArrowLeftRight className="h-3 w-3" />
                  Swap
                </Button> */}
              </div>
            </div>
          </div>

          {/* Token Assets */}
          <div className="flex-1 bg-white rounded-lg">
            {/* Section header */}
            <div className="px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-gray-900">Token Assets</div>
              </div>
            </div>

            {/* Token list */}
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="flex flex-col pl-2 gap-2">
                  {Array.from({ length: 3 }).map((_, index) => avatarSkeleton(index))}
                </div>
              ) : (
                tokenData.map((token, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-50 last:border-b-0"
                  >
                    <div className="flex items-center gap-3">
                      {/* Token icon */}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold`}
                      >
                        {/* {token.icon} */}
                        <img src={token.icon} />
                      </div>
                      <div>
                        <div className="font-medium text-sm text-gray-900">{token.symbol}</div>
                        <div className="text-xs text-gray-500">{token.name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-sm text-gray-900">{token.balance}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
