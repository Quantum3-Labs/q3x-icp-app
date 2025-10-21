import { IDL } from '@dfinity/candid';
import { hexToBytes } from './helper';
import { Principal } from '@dfinity/principal';

export enum MessageType {
  ADD_SIGNER = "ADD_SIGNER",
  REMOVE_SIGNER = "REMOVE_SIGNER",
  SET_THRESHOLD = "SET_THRESHOLD",
  TRANSFER = "TRANSFER",
  TRANSFER_EVM = "TRANSFER_EVM",
  BATCH = "BATCH",
}

export interface IcpTransfer {
  to_principal: Principal;
  to_subaccount: number[] | null; // Opt(Vec(Nat8)) = array or null
  memo: bigint | null; // Opt(Nat64) = bigint or null
  amount: bigint; // Nat64 = bigint
}

export interface EvmTransfer {
  to: string; // Text = string
  value: bigint; // Nat = bigint
  chain_id: bigint; // Nat64 = bigint
  gas_limit: bigint; // Nat64 = bigint
  gas_price: bigint; // Nat = bigint
}

// Transaction variant type
export type TransactionTypeBatch = 
  | { IcpTransfer: IcpTransfer }
  | { EvmTransfer: EvmTransfer };

// Main BatchTransaction type
export interface BatchTransaction {
  id: string; // Text = string
  description: string; // Text = string
  created_at: bigint; // Nat64 = bigint
  created_by: Principal; // Principal
  transactions: TransactionTypeBatch[]; // Vec = array
}

export interface PendingMessage {
  id: string;
  type: MessageType;
  data: string;
  batchData?: BatchTransaction;
  signers: string[];
  approveNumber: number;
  needsApproval: boolean;
  rawMessage: string;
  threshold?: number;
}

export const decodeBatchMessage = (messageString: string) => {
  try {
    const BatchTransaction = IDL.Record({
      id: IDL.Text,
      description: IDL.Text,
      created_at: IDL.Nat64,
      created_by: IDL.Principal,
      transactions: IDL.Vec(
        IDL.Variant({
          IcpTransfer: IDL.Record({
            to_principal: IDL.Principal,
            to_subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
            memo: IDL.Opt(IDL.Nat64),
            amount: IDL.Nat64,
          }),
          EvmTransfer: IDL.Record({
            to: IDL.Text,
            value: IDL.Nat,
            chain_id: IDL.Nat64,
            gas_limit: IDL.Nat64,
            gas_price: IDL.Nat,
          }),
        }),
      ),
    });

    const [, batchId, candidHex] = messageString.split("::");
    const candidBytes = hexToBytes(candidHex);
    const [decodedBatch] = IDL.decode([BatchTransaction], candidBytes);

    const batch = decodedBatch as any;
    return {
      batchId: batch.id,
      description: batch.description,
      createdAt: new Date(Number(batch.created_at) / 1000000),
      createdBy: batch.created_by.toString(),
      transactions: batch.transactions,
    };
  } catch (error) {
    console.error("❌ Decode error:", error);
    return null;
  }
};

// TODO: refactor when change final canister: Current - Parse message queue to structured data
export const parseMessageQueue = (messageQueue: any[], threshold: number): PendingMessage[] => {
  if (!messageQueue || messageQueue.length === 0) return [];

  return messageQueue.map(([messageBytes, signers], index) => {
    const messageString = new TextDecoder().decode(messageBytes);
    
    let type: MessageType;
    let data: string = "";
    let batchData: any;

    if (messageString.startsWith("ADD_SIGNER::")) {
      type = MessageType.ADD_SIGNER;
      data = messageString.replace("ADD_SIGNER::", "");
    } else if (messageString.startsWith("REMOVE_SIGNER::")) {
      type = MessageType.REMOVE_SIGNER;
      data = messageString.replace("REMOVE_SIGNER::", "");
    } else if (messageString.startsWith("SET_THRESHOLD::")) {
      type = MessageType.SET_THRESHOLD;
      data = messageString.replace("SET_THRESHOLD::", "");
    } else if (messageString.startsWith("TRANSFER::")) {
      type = MessageType.TRANSFER;
      data = messageString.replace("TRANSFER::", "");
    } else if (messageString.startsWith("TRANSFER_EVM::")) {
      type = MessageType.TRANSFER_EVM;
      data = messageString.replace("TRANSFER_EVM::", "");
    } else if (messageString.startsWith("BATCH::")) {
      type = MessageType.BATCH;
      batchData = decodeBatchMessage(messageString);
    } else {
      type = MessageType.ADD_SIGNER; // fallback
      data = messageString;
    }

    return {
      id: `msg-${index}`, // TODO: not use index as id
      type,
      data,
      batchData: batchData,
      signers,
      approveNumber: signers.length,
      needsApproval: signers.length < threshold,
      rawMessage: messageString,
      threshold: threshold,
    };
  });
};
