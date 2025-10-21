import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  Logger,
  Delete,
  Query,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import {
  AddSignerDto,
  AddSignerResponseDto,
  CreateSubaccountDto,
  CreateSubaccountResponseDto,
  CreateWalletDto,
  RemoveSignerResponseDto,
  SubaccountsResponseDto,
} from '@q3x/models';
import {
  CreateWalletResponseDto,
  DeleteWalletResponseDto,
  WalletResponseDto,
  WalletsResponseDto,
  WalletStatusResponseDto,
} from '@q3x/models';
import { WALLET_RESPONSE_MESSAGE } from '@/common/constants';

@Controller('wallets')
export class WalletController {
  private readonly logger = new Logger(WalletController.name);

  constructor(private readonly walletService: WalletService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createWallet(
    @Body() createWalletDto: CreateWalletDto,
  ): Promise<CreateWalletResponseDto> {
    this.logger.log('Creating new wallet');
    const wallet = await this.walletService.createUserWallet(createWalletDto);

    return {
      success: true,
      data: wallet,
      message: WALLET_RESPONSE_MESSAGE.CREATE_WALLET_SUCCESS,
    };
  }

  @Get(':canisterId')
  async getWallet(
    @Param('canisterId') canisterId: string,
  ): Promise<WalletResponseDto> {
    this.logger.log(`Getting wallet: ${canisterId}`);
    const wallet = await this.walletService.getWallet(canisterId);

    return {
      success: true,
      data: wallet,
    };
  }

  @Get()
  async getAllWalletsByPrincipal(
    @Query('principal') principal?: string,
  ): Promise<WalletsResponseDto> {
    if (principal) {
      this.logger.log(`Getting wallets for principal: ${principal}`);
      const wallets = await this.walletService.getWalletsByPrincipal(principal);

      return {
        success: true,
        data: wallets,
        count: wallets.length,
      };
    }
  }

  @Delete(':canisterId')
  @HttpCode(HttpStatus.OK)
  async deleteWallet(
    @Param('canisterId') canisterId: string,
  ): Promise<DeleteWalletResponseDto> {
    this.logger.log(`Deleting wallet: ${canisterId}`);

    await this.walletService.deleteUserWallet(canisterId);

    return {
      success: true,
      message: WALLET_RESPONSE_MESSAGE.DELETE_WALLET_SUCCESS(canisterId),
    };
  }

  @Get(':canisterId/status')
  async getWalletStatus(
    @Param('canisterId') canisterId: string,
  ): Promise<WalletStatusResponseDto> {
    this.logger.log(`Getting wallet status: ${canisterId}`);
    const status = await this.walletService.getWalletStatus(canisterId);

    return {
      success: true,
      data: status,
    };
  }

  @Post('chains')
  async createSubaccount(
    @Body() createDto: CreateSubaccountDto,
  ): Promise<CreateSubaccountResponseDto> {
    this.logger.log(`Creating subaccount for wallet: ${createDto.canisterId}`);
    const subaccount = await this.walletService.createSubaccount(createDto);

    return {
      success: true,
      data: subaccount,
      message: WALLET_RESPONSE_MESSAGE.CREATE_SUBACCOUNT_SUCCESS,
    };
  }

  @Get(':canisterId/chains')
  async getSubaccounts(
    @Param('canisterId') canisterId: string,
  ): Promise<SubaccountsResponseDto> {
    this.logger.log(`Getting subaccounts for wallet: ${canisterId}`);
    const subaccounts = await this.walletService.getSubaccounts(canisterId);

    return {
      success: true,
      data: subaccounts,
      count: subaccounts.length,
    };
  }

  @Post(':canisterId/signers')
  @HttpCode(HttpStatus.CREATED)
  async addSigner(
    @Param('canisterId') canisterId: string,
    @Body() addSignerDto: AddSignerDto,
  ): Promise<AddSignerResponseDto> {
    this.logger.log(
      `Adding signer ${addSignerDto.principal} to wallet: ${canisterId}`,
    );
    await this.walletService.addSigner(canisterId, addSignerDto.principal);

    return {
      success: true,
      message: WALLET_RESPONSE_MESSAGE.ADD_SIGNER_SUCCESS,
    };
  }

  @Delete(':canisterId/signers/:principal')
  @HttpCode(HttpStatus.OK)
  async removeSigner(
    @Param('canisterId') canisterId: string,
    @Param('principal') principal: string,
  ): Promise<RemoveSignerResponseDto> {
    this.logger.log(`Removing signer ${principal} from wallet: ${canisterId}`);
    await this.walletService.removeSigner(canisterId, principal);

    return {
      success: true,
      message: WALLET_RESPONSE_MESSAGE.REMOVE_SIGNER_SUCCESS,
    };
  }
}
