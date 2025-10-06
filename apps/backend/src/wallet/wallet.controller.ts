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
import { CreateWalletDto } from '@q3x/models';
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
}
