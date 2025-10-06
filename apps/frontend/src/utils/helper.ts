import { AccountIdentifier } from "@dfinity/ledger-icp";
import { Principal } from "@dfinity/principal";

export const stringToHex = (str: string): string => {
  return Array.from(new TextEncoder().encode(str))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
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
