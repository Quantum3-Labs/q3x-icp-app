export const formatTokenBalance = (balanceHex: string, symbol: string): string => {
  try {
    const balance = BigInt(balanceHex);
    const decimals = getTokenDecimals(symbol);
    const divisor = BigInt(10 ** decimals);
    const formattedBalance = Number(balance) / Number(divisor);
    return formattedBalance.toFixed(decimals === 6 ? 2 : 6);
  } catch {
    return "0";
  }
};

export const getTokenDecimals = (symbol: string): number => {
  const decimalMap: Record<string, number> = {
    USDC: 6,
    USDT: 6,
    WBTC: 8,
    DAI: 18,
    LINK: 18,
  };
  return decimalMap[symbol] || 18;
};

export const getTokenName = (symbol: string): string => {
  const nameMap: Record<string, string> = {
    USDC: "USD Coin",
    USDT: "Tether",
    WBTC: "Wrapped Bitcoin",
    DAI: "Dai Stablecoin",
    LINK: "Chainlink",
  };
  return nameMap[symbol] || symbol;
};
