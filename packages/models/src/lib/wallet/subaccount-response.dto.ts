import { ApiResponse, ListResponse } from '../api/api-response.dto';
import { WalletChain } from './wallet-chain.model';

export interface CreateSubaccountResponseDto extends ApiResponse<WalletChain> {
  success: true;
  data: WalletChain;
  message: string;
}

export interface SubaccountResponseDto extends ApiResponse<WalletChain> {
  success: true;
  data: WalletChain;
}

export interface SubaccountsResponseDto extends ListResponse<WalletChain> {
  success: true;
  data: WalletChain[];
  count: number;
}

export interface UpdateSubaccountResponseDto extends ApiResponse<WalletChain> {
  success: true;
  data: WalletChain;
  message: string;
}

export interface DeleteSubaccountResponseDto extends ApiResponse<null> {
  success: true;
  message: string;
}
