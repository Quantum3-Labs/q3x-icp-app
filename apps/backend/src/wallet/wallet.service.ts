import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DeploymentStatus } from '@q3x/prisma';
import { PrismaService } from '@/database/prisma.service';
import { CanisterManagerService } from '@/icp/services/canister-manager.service';
import { WasmLoaderService } from '@/icp/services/wasm-loader.service';
import {
  CreateSubaccountDto,
  CreateWalletDto,
  SimplifiedCanisterStatus,
  Wallet,
  WalletChain,
} from '@q3x/models';

@Injectable()
export class WalletService {
  private readonly logger = new Logger(WalletService.name);

  constructor(
    private prismaService: PrismaService,
    private canisterManagerService: CanisterManagerService,
    private wasmLoaderService: WasmLoaderService,
  ) {}

  async createUserWallet(createWalletDto: CreateWalletDto): Promise<Wallet> {
    const { metadata, name, creatorPrincipal, signers } = createWalletDto;
    const uniqueSuffix =
      Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    const internalName = `${name}:::${uniqueSuffix}`;

    try {
      // Step 1: Create canister FIRST, then save to database
      const createResult = await this.canisterManagerService.createCanister();
      const { canisterId } = createResult;

      this.logger.log(`Canister created: ${canisterId}`);

      // Step 2: Create database record with actual canister ID
      const deployedWallet = await this.prismaService.$transaction(
        async (tx) => {
          // Batch find all existing users
          const existingUsers = await tx.user.findMany({
            where: {
              principal: {
                in: signers,
              },
            },
          });

          // Identify missing principals
          const existingPrincipals = new Set(
            existingUsers.map((user) => user.principal),
          );
          const missingPrincipals = signers.filter(
            (principal) => !existingPrincipals.has(principal),
          );

          // Batch create missing users
          const newUsers = [];
          if (missingPrincipals.length > 0) {
            const createManyResult = await tx.user.createMany({
              data: missingPrincipals.map((principal) => ({
                principal,
                displayName: `User ${principal.substring(0, 8)}...`,
              })),
              skipDuplicates: true, // Handle race conditions
            });

            this.logger.log(`Created ${createManyResult.count} new users`);

            // Get the newly created users
            const createdUsers = await tx.user.findMany({
              where: {
                principal: {
                  in: missingPrincipals,
                },
              },
            });
            newUsers.push(...createdUsers);
          }

          // Combine all users
          const allUsers = [...existingUsers, ...newUsers];

          // Create wallet with signers
          const wallet = await tx.deployedWallet.create({
            data: {
              canisterId,
              name: internalName,
              status: DeploymentStatus.DEPLOYING,
              metadata: {
                ...metadata,
                createdBy: creatorPrincipal,
              },
              signers: {
                create: allUsers.map((user) => ({
                  userId: user.id,
                })),
              },
            },
          });

          return wallet;
        },
      );

      try {
        // Step 3: Install WASM code
        const installResult =
          await this.canisterManagerService.installCode(canisterId);

        // Step 4: Update status to DEPLOYED
        const finalWallet = await this.prismaService.deployedWallet.update({
          where: { id: deployedWallet.id },
          data: {
            status: DeploymentStatus.DEPLOYED,
            wasmHash: installResult.wasmHash,
            metadata: {
              ...metadata,
              deployedAt: new Date().toISOString(),
              wasmSize: this.wasmLoaderService.getAssetInfo().wasmSize,
            },
          },
        });

        this.logger.log(`Wallet deployed successfully: ${canisterId}`);
        return new Wallet(finalWallet);
      } catch (deployError) {
        // Update status to FAILED if installation fails
        await this.prismaService.deployedWallet.update({
          where: { id: deployedWallet.id },
          data: {
            status: DeploymentStatus.FAILED,
            metadata: {
              ...metadata,
              error: deployError.message,
              failedAt: new Date().toISOString(),
            },
          },
        });

        throw deployError;
      }
    } catch (error) {
      this.logger.error('Failed to create wallet', error);
      throw new BadRequestException(
        `Failed to create wallet: ${error.message}`,
      );
    }
  }

  async getWallet(canisterId: string): Promise<Wallet> {
    try {
      const wallet = await this.prismaService.deployedWallet.findUnique({
        where: { canisterId },
        select: {
          canisterId: true,
          metadata: true,
          status: true,
          name: true,
        },
      });

      if (!wallet) {
        throw new NotFoundException(
          `Wallet with canister ID ${canisterId} not found`,
        );
      }

      return new Wallet(wallet);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to get wallet ${canisterId}`, error);
      throw new BadRequestException(`Failed to get wallet: ${error.message}`);
    }
  }

  async getAllWallets(): Promise<Wallet[]> {
    try {
      const wallets = await this.prismaService.deployedWallet.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
          canisterId: true,
          name: true,
        },
      });

      return wallets.map((wallet) => new Wallet(wallet));
    } catch (error) {
      this.logger.error('Failed to get all wallets', error);
      throw new BadRequestException(`Failed to get wallets: ${error.message}`);
    }
  }

  async getWalletsByPrincipal(principal: string): Promise<Wallet[]> {
    const wallets = await this.prismaService.deployedWallet.findMany({
      where: {
        signers: {
          some: {
            user: {
              principal: principal,
            },
          },
        },
      },
      include: {
        signers: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return wallets.map((wallet) => new Wallet(wallet));
  }

  async getWalletById(walletId: string, principal: string): Promise<Wallet> {
    const wallet = await this.prismaService.deployedWallet.findFirst({
      where: {
        id: walletId,
        signers: {
          some: {
            user: {
              principal: principal,
            },
          },
        },
      },
      include: {
        signers: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found or access denied');
    }

    return new Wallet(wallet);
  }

  async deleteUserWallet(canisterId: string): Promise<boolean> {
    try {
      // Verify wallet exists in database
      await this.getWallet(canisterId);

      // Verify canister exists on IC
      const status =
        await this.canisterManagerService.getCanisterStatus(canisterId);
      if (!status) {
        throw new NotFoundException(
          `Canister ${canisterId} not found on the Internet Computer`,
        );
      }

      this.logger.log(`Deleting wallet canister: ${canisterId}`);

      // Delete canister from IC
      await this.canisterManagerService.deleteCanister(canisterId);

      // Update database status
      await this.prismaService.deployedWallet.update({
        where: { canisterId },
        data: {
          status: DeploymentStatus.STOPPED,
        },
      });

      this.logger.log(`Wallet ${canisterId} deleted successfully`);
      return true;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      this.logger.error(`Failed to delete wallet ${canisterId}`, error);
      throw new BadRequestException(
        `Failed to delete wallet: ${error.message}`,
      );
    }
  }

  async getWalletStatus(canisterId: string): Promise<SimplifiedCanisterStatus> {
    try {
      // Get from database
      await this.getWallet(canisterId);

      // Get live status from ICP
      const icpStatus =
        await this.canisterManagerService.getCanisterStatus(canisterId);

      return icpStatus;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      this.logger.error(`Failed to get wallet status ${canisterId}`, error);
      throw new BadRequestException(
        `Failed to get wallet status: ${error.message}`,
      );
    }
  }

  // Subaccount
  async createSubaccount(createDto: CreateSubaccountDto): Promise<WalletChain> {
    const { canisterId, chainId, chainName, displayName, evmAddress } = createDto;

    this.logger.log(`Creating subaccount for wallet: ${canisterId}`);
    this.logger.log(`Creating subaccount for chain: ${chainId}`);
    try {
      // Check if wallet exists
      const wallet = await this.prismaService.deployedWallet.findUnique({
        where: { canisterId },
      });

      if (!wallet) {
        throw new NotFoundException(`Wallet with ID ${canisterId} not found`);
      }

      // Check if subaccount already exists
      const existingSubaccount =
        await this.prismaService.walletChain.findUnique({
          where: {
            canisterId_chainId: {
              canisterId,
              chainId,
            },
          },
        });

      if (existingSubaccount) {
        throw new BadRequestException(
          `Subaccount for chain ${chainId} already exists`,
        );
      }

      // Create subaccount
      const subaccount = await this.prismaService.walletChain.create({
        data: {
          canisterId,
          chainId,
          chainName,
          displayName,
          evmAddress: evmAddress,
        },
      });

      return new WalletChain(subaccount);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      this.logger.error(
        `Failed to create subaccount for wallet ${canisterId}`,
        error,
      );
      throw new BadRequestException(
        `Failed to create subaccount: ${error.message}`,
      );
    }
  }

  async getSubaccounts(canisterId: string): Promise<WalletChain[]> {
    try {
      // Check if wallet exists
      const wallet = await this.prismaService.deployedWallet.findUnique({
        where: { canisterId },
      });

      if (!wallet) {
        throw new NotFoundException(`Wallet with ID ${canisterId} not found`);
      }

      // Get all subaccounts
      const subaccounts = await this.prismaService.walletChain.findMany({
        where: { canisterId },
        orderBy: { createdAt: 'asc' },
      });

      return subaccounts.map((subaccount) => new WalletChain(subaccount));
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to get subaccounts for wallet ${canisterId}`,
        error,
      );
      throw new BadRequestException(
        `Failed to get subaccounts: ${error.message}`,
      );
    }
  }

  async addSigner(canisterId: string, principal: string): Promise<void> {
    try {
      // Check if wallet exists
      const wallet = await this.prismaService.deployedWallet.findUnique({
        where: { canisterId: canisterId },
        include: {
          signers: {
            include: {
              user: true,
            },
          },
        },
      });

      if (!wallet) {
        throw new NotFoundException(`Wallet with ID ${canisterId} not found`);
      }

      // Check if signer already exists
      const existingSigner = wallet.signers.find(
        (signer) => signer.user.principal === principal,
      );

      if (existingSigner) {
        throw new BadRequestException(
          `Signer ${principal} already exists in wallet`,
        );
      }

      // Create or find user
      let user = await this.prismaService.user.findUnique({
        where: { principal },
      });

      if (!user) {
        user = await this.prismaService.user.create({
          data: {
            principal,
            displayName: `User ${principal.substring(0, 8)}...`,
          },
        });
        this.logger.log(`Created new user: ${principal}`);
      }

      // Add signer to wallet
      await this.prismaService.walletSigner.create({
        data: {
          canisterId: wallet.canisterId,
          userId: user.id,
        },
      });

      this.logger.log(`Added signer ${principal} to wallet ${canisterId}`);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      this.logger.error(
        `Failed to add signer ${principal} to wallet ${canisterId}`,
        error,
      );
      throw new BadRequestException(`Failed to add signer: ${error.message}`);
    }
  }

  async removeSigner(canisterId: string, principal: string): Promise<void> {
    try {
      // Check if wallet exists
      const wallet = await this.prismaService.deployedWallet.findUnique({
        where: { canisterId },
        include: {
          signers: {
            include: {
              user: true,
            },
          },
        },
      });

      if (!wallet) {
        throw new NotFoundException(`Wallet with ID ${canisterId} not found`);
      }

      // Check if signer exists
      const signerToRemove = wallet.signers.find(
        (signer) => signer.user.principal === principal,
      );

      if (!signerToRemove) {
        throw new NotFoundException(
          `Signer ${principal} not found in wallet ${canisterId}`,
        );
      }

      // Remove signer from wallet
      await this.prismaService.walletSigner.delete({
        where: {
          id: signerToRemove.id,
        },
      });

      this.logger.log(`Removed signer ${principal} from wallet ${canisterId}`);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      this.logger.error(
        `Failed to remove signer ${principal} from wallet ${canisterId}`,
        error,
      );
      throw new BadRequestException(
        `Failed to remove signer: ${error.message}`,
      );
    }
  }
}
