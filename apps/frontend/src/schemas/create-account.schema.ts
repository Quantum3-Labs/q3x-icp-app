import { z } from "zod";
import { Principal } from "@dfinity/principal";

export const principalSchema = z.string().refine(
  val => {
    try {
      Principal.fromText(val.trim());
      return true;
    } catch {
      return false;
    }
  },
  {
    message: "Invalid principal format",
  },
);

const signerObjectSchema = z.object({
  address: principalSchema,
});

export const createAccountSchema = z
  .object({
    // Account Name
    accountName: z
      .string()
      .min(1, "Account name is required")
      .max(30, "Account name must be less than 30 characters")
      .regex(/^[a-zA-Z0-9\s-_]+$/, "Account name can only contain letters, numbers, spaces, hyphens and underscores"),

    // Signers
    signers: z
      .array(signerObjectSchema)
      .min(1, "At least one signer is required")
      .max(10, "Maximum 10 signers allowed")
      .refine(
        signers => {
          // Check for duplicate addresses
          const uniqueAddresses = new Set(signers.map(s => s.address.trim()));
          return signers.length === uniqueAddresses.size;
        },
        {
          message: "Duplicate signer addresses are not allowed",
        },
      ),

    // Threshold
    threshold: z.number().min(1, "Threshold must be at least 1"),
  })
  .refine(
    data => {
      return data.threshold <= data.signers.length;
    },
    {
      message: "Threshold cannot exceed number of signers",
      path: ["threshold"], // Specify which field the error belongs to
    },
  );

export type CreateAccountFormData = z.infer<typeof createAccountSchema>;
