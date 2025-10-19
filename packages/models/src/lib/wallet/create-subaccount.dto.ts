import { IsNotEmpty, IsString } from "class-validator";

export class CreateSubaccountDto {
  @IsString()
  @IsNotEmpty()
  walletId: string;

  @IsString()
  @IsNotEmpty()
  chainId: string;

  @IsString()
  @IsNotEmpty()
  chainName: string;

  @IsString()
  @IsNotEmpty()
  displayName: string;

  @IsString()
  @IsNotEmpty()
  evmAddress: string;
}
