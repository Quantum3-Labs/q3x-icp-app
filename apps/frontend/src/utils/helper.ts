import { AccountIdentifier } from "@dfinity/ledger-icp";
import { Principal } from "@dfinity/principal";
import { toast } from "sonner";
import { PortfolioBalance, Token } from "@q3x/models";
import { formatTokenBalance, getTokenName } from "./token.helper";

export const stringToHex = (str: string): string => {
  return Array.from(new TextEncoder().encode(str))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
};

export const hexToBytes = (hex: string): Uint8Array => {
  return new Uint8Array(Buffer.from(hex, "hex"));
};

export const getAccountAddressFromPrincipal = (principalStr: string): string => {
  try {
    const principal = Principal.fromText(principalStr);
    const accountId = AccountIdentifier.fromPrincipal({ principal });
    return accountId.toHex();
  } catch (error) {
    return "----";
  }
};

export const getShortenedAddress = (address: string, start = 3, end = 3) => {
  if (address.length <= 10) return address;
  return `${address.slice(0, start)}...${address.slice(-end)}`;
};

export const formatWeiToEther = (weiHex: string): string => {
  try {
    const wei = BigInt(weiHex);
    const ether = Number(wei) / 1e18;
    return ether.toFixed(6);
  } catch {
    return "0";
  }
};

export const copyAddressToClipboard = (address: string) => {
  navigator.clipboard.writeText(address);
  toast.info("Address copied to clipboard!");
};

export const getAmountInICP = (amountInE8s: string): string => {
  return (parseInt(amountInE8s) / 100_000_000).toFixed(8);
};

export const getAmountByCoinType = (amount: string, coinType: string) => {
  if (coinType === "ICP") {
    return getAmountInICP(amount);
  } else if (coinType === "ETH") {
    return formatWeiToEther(amount);
  } else {
    return amount;
  }
};

export const buildAvailableTokens = (portfolio: PortfolioBalance, symbol = "icp"): Token[] => {
  symbol = symbol.toLowerCase();
  const tokens: Token[] = [];

  if (portfolio) {
    if ((symbol === "icp")) {
      // ICP balance
      const icpBalance = portfolio?.icp_balance?.balance_icp;
      tokens.push({
        id: "icp",
        name: "Internet Computer",
        symbol: "ICP",
        icon: "/token/icp.svg",
        chainId: "0",
        balance: icpBalance,
      });
    } else if (symbol === "eth") {
      // ICP balance
      const ethBalance = formatWeiToEther(portfolio.native_balance || "0");
      tokens.push({
        id: "eth",
        name: "Ethereum",
        symbol: "ETH",
        icon: "/token/eth.svg",
        chainId: "11155111",
        balance: ethBalance,
      });
    } else if (symbol === "arb") {
      // ICP balance
      const arbBalance = formatWeiToEther(portfolio.native_balance || "0");
      tokens.push({
        id: "arb",
        name: "Arbitrum",
        symbol: "ARB",
        icon: "/token/arb.svg",
        chainId: "421614",
        balance: arbBalance,
      });
    }

    // Native ETH balance
    // const ethBalance = formatWeiToEther(portfolio.native_balance);
    // tokens.push({
    //   id: "eth",
    //   name: "Ethereum",
    //   symbol: "ETH",
    //   icon: "/token/eth.svg",
    //   balance: ethBalance,
    // });

    // ERC-20 tokens with non-zero balance
    // portfolio.token_balances
    //   .forEach(token => {
    //     const tokenBalance = formatTokenBalance(token.balance, token.symbol);
    //     tokens.push({
    //       id: token.symbol.toLowerCase(),
    //       name: getTokenName(token.symbol),
    //       symbol: token.symbol,
    //       icon: `/token/${token.symbol.toLowerCase()}.svg`,
    //       balance: tokenBalance,
    //     });
    //   });
  }

  return tokens;
};
