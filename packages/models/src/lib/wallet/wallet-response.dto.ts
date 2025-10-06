import { ApiResponse, ListResponse } from '../api/api-response.dto';
import { SimplifiedCanisterStatus } from '../icp/icp.model';
import { Wallet } from './wallet.model';

export interface CreateWalletResponseDto extends ApiResponse<Wallet> {
  success: true;
  data: Wallet;
  message: string;
}

export interface WalletResponseDto extends ApiResponse<Wallet> {
  success: true;
  data: Wallet;
}

export interface WalletsResponseDto extends ListResponse<Wallet> {
  success: true;
  data: Wallet[];
  count: number;
}

export interface DeleteWalletResponseDto extends ApiResponse<null> {
  success: true;
  message: string;
}

export interface WalletStatusResponseDto extends ApiResponse<any> {
  success: true;
  data: SimplifiedCanisterStatus;
}
