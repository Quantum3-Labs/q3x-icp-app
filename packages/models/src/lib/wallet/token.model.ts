export interface ICPBalance {
  balance_e8s: number;
  balance_icp: string;
  account_id: string;
}

export interface TokenBalance {
  symbol: string;
  contract_address: string;
  balance: string;
  success: boolean;
  error?: string;
}

export interface PortfolioBalance {
  icp_balance: ICPBalance;
  native_balance: string;
  native_symbol: string;
  token_balances: TokenBalance[];
  wallet_address: string;
  chain_id: number;
}

export interface Token {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  balance: string;
  chainId?: string;
}
