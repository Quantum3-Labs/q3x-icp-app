"use client";

import { usePortfolio } from "@/hooks/api/usePortfolio";
import { useAuthStore, useCanisterStore, useWalletStore } from "@/store";
import { useEffect } from "react";

export default function StoreInitializer() {
  const { identity } = useAuthStore();
  const { setActor } = useCanisterStore();
  const { currentWallet } = useWalletStore();

  // add this to load when app initializes
  usePortfolio();

  useEffect(() => {
    if (identity && currentWallet?.canisterId) {
      setActor(currentWallet.canisterId);
    }
  }, [currentWallet, identity, setActor]);

  return null;
}
