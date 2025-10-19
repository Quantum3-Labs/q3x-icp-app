import { z } from "zod";
import { Principal } from "@dfinity/principal";

export const sendTransactionSchema = z.object({
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine(val => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Amount must be a positive number"
    }),
  
  address: z.string().min(1, "Address is required"),
  
  token: z.object({
    id: z.string(),
    symbol: z.string(),
    chainId: z.string(),
  })
})
.refine(data => {
  // Check address format based on selected token
  if (data.token.id === "icp") {
    try {
      Principal.fromText(data.address.trim());
      return true;
    } catch {
      return false;
    }
  } else {
    // EVM token - check ETH address format
    return /^0x[a-fA-F0-9]{40}$/.test(data.address.trim());
  }
}, {
  message: "Invalid address format for selected token",
  path: ["address"]
});

export type SendTransactionFormData = z.infer<typeof sendTransactionSchema>;