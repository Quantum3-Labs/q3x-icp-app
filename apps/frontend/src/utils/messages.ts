export enum MessageType {
  ADD_SIGNER = 'ADD_SIGNER',
  REMOVE_SIGNER = 'REMOVE_SIGNER',
  SET_THRESHOLD = 'SET_THRESHOLD',
  TRANSFER = 'TRANSFER'
}

export interface PendingMessage {
  id: string;
  type: MessageType;
  data: string;
  signers: string[];
  approveNumber: number;
  needsApproval: boolean;
  rawMessage: string;
}

// TODO: refactor when change final canister: Current - Parse message queue to structured data
export const parseMessageQueue = (messageQueue: any[], threshold: number): PendingMessage[] => {
  if (!messageQueue || messageQueue.length === 0) return [];

  return messageQueue.map(([messageBytes, signers], index) => {
    const messageString = new TextDecoder().decode(messageBytes);
    let type: MessageType;
    let data: string;

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
    } else {
      type = MessageType.ADD_SIGNER; // fallback
      data = messageString;
    }

    return {
      id: `msg-${index}`, // TODO: not use index as id
      type,
      data,
      signers,
      approveNumber: signers.length,
      needsApproval: signers.length < threshold,
      rawMessage: messageString
    };
  });
};