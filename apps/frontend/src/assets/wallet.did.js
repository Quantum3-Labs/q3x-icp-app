export const idlFactory = ({ IDL }) => {
  const Result = IDL.Variant({ 'Ok' : IDL.Null, 'Err' : IDL.Text });
  const Result_1 = IDL.Variant({ 'Ok' : IDL.Text, 'Err' : IDL.Text });
  const Result_2 = IDL.Variant({ 'Ok' : IDL.Nat8, 'Err' : IDL.Text });
  const ICPBalance = IDL.Record({
    'account_id' : IDL.Text,
    'balance_e8s' : IDL.Nat64,
    'balance_icp' : IDL.Text,
  });
  const Result_3 = IDL.Variant({ 'Ok' : ICPBalance, 'Err' : IDL.Text });
  const Result_4 = IDL.Variant({ 'Ok' : IDL.Vec(IDL.Text), 'Err' : IDL.Text });
  const Result_5 = IDL.Variant({
    'Ok' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Vec(IDL.Text))),
    'Err' : IDL.Text,
  });
  const Result_6 = IDL.Variant({ 'Ok' : IDL.Nat64, 'Err' : IDL.Text });
  const Wallet = IDL.Record({
    'threshold' : IDL.Nat8,
    'metadata' : IDL.Vec(IDL.Tuple(IDL.Vec(IDL.Nat8), IDL.Text)),
    'signers' : IDL.Vec(IDL.Text),
    'message_queue' : IDL.Vec(IDL.Tuple(IDL.Vec(IDL.Nat8), IDL.Vec(IDL.Text))),
  });
  const TokenBalance = IDL.Record({
    'balance' : IDL.Text,
    'error' : IDL.Opt(IDL.Text),
    'success' : IDL.Bool,
    'contract_address' : IDL.Text,
    'symbol' : IDL.Text,
  });
  const PortfolioBalance = IDL.Record({
    'native_symbol' : IDL.Text,
    'wallet_address' : IDL.Text,
    'chain_id' : IDL.Nat64,
    'token_balances' : IDL.Vec(TokenBalance),
    'icp_balance' : ICPBalance,
    'native_balance' : IDL.Text,
  });
  const Result_7 = IDL.Variant({ 'Ok' : PortfolioBalance, 'Err' : IDL.Text });
  const TransactionType = IDL.Variant({
    'IcpTransfer' : IDL.Record({
      'to_principal' : IDL.Principal,
      'to_subaccount' : IDL.Opt(IDL.Vec(IDL.Nat8)),
      'memo' : IDL.Opt(IDL.Nat64),
      'amount' : IDL.Nat64,
    }),
    'EvmTransfer' : IDL.Record({
      'to' : IDL.Text,
      'value' : IDL.Nat,
      'chain_id' : IDL.Nat64,
      'gas_limit' : IDL.Nat64,
      'gas_price' : IDL.Nat,
    }),
  });
  const BatchTransaction = IDL.Record({
    'id' : IDL.Text,
    'description' : IDL.Text,
    'created_at' : IDL.Nat64,
    'created_by' : IDL.Principal,
    'transactions' : IDL.Vec(TransactionType),
  });
  const TransferEvmArgs = IDL.Record({
    'to' : IDL.Text,
    'value' : IDL.Nat,
    'chain_id' : IDL.Nat64,
    'gas_limit' : IDL.Nat64,
    'wallet_id' : IDL.Text,
    'gas_price' : IDL.Nat,
  });
  const Result_8 = IDL.Variant({ 'Ok' : IDL.Bool, 'Err' : IDL.Text });
  return IDL.Service({
    'add_metadata' : IDL.Func([IDL.Text, IDL.Text, IDL.Text], [Result], []),
    'add_signer' : IDL.Func([IDL.Text, IDL.Principal], [Result_1], []),
    'approve' : IDL.Func([IDL.Text, IDL.Text], [Result_2], []),
    'can_sign' : IDL.Func([IDL.Text, IDL.Text], [IDL.Bool], []),
    'create_wallet' : IDL.Func(
        [IDL.Text, IDL.Vec(IDL.Principal), IDL.Nat8],
        [Result],
        [],
      ),
    'get_evm_address' : IDL.Func([IDL.Text], [Result_1], []),
    'get_icp_balance' : IDL.Func([IDL.Text], [Result_3], []),
    'get_messages_to_sign' : IDL.Func([IDL.Text], [Result_4], []),
    'get_messages_with_signers' : IDL.Func([IDL.Text], [Result_5], []),
    'get_metadata' : IDL.Func([IDL.Text, IDL.Text], [Result_1], []),
    'get_proposed_messages' : IDL.Func([IDL.Text], [Result_4], []),
    'get_transaction_count' : IDL.Func([IDL.Text, IDL.Nat64], [Result_6], []),
    'get_wallet' : IDL.Func([IDL.Text], [IDL.Opt(Wallet)], []),
    'get_wallet_portfolio' : IDL.Func([IDL.Text, IDL.Nat64], [Result_7], []),
    'get_wallets_for_principal' : IDL.Func(
        [IDL.Principal],
        [IDL.Vec(IDL.Text)],
        ['query'],
      ),
    'propose' : IDL.Func([IDL.Text, IDL.Text], [Result], []),
    'propose_batch_transaction' : IDL.Func(
        [IDL.Text, BatchTransaction],
        [Result_1],
        [],
      ),
    'propose_with_metadata' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text],
        [Result],
        [],
      ),
    'remove_signer' : IDL.Func([IDL.Text, IDL.Principal], [Result_1], []),
    'set_threshold' : IDL.Func([IDL.Text, IDL.Nat8], [Result_1], []),
    'sign' : IDL.Func([IDL.Text, IDL.Text], [Result_1], []),
    'transfer' : IDL.Func([IDL.Text, IDL.Nat64, IDL.Principal], [Result_1], []),
    'transfer_evm' : IDL.Func([TransferEvmArgs], [Result_1], []),
    'verify_signature' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text],
        [Result_8],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return [IDL.Text]; };
