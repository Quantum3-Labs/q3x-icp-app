export const WALLET_RESPONSE_MESSAGE = {
  CREATE_WALLET_SUCCESS: 'Wallet created successfully',
  DELETE_WALLET_SUCCESS: (canisterId: string) =>
    `Wallet ${canisterId} deleted successfully`,
  CREATE_SUBACCOUNT_SUCCESS: 'Subaccount created successfully',
  ADD_SIGNER_SUCCESS: "Signer added successfully",
  REMOVE_SIGNER_SUCCESS: "Signer removed successfully",
};
