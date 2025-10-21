# Q3X ICP Application

Q3x is an one-stop, privacy-first programmable multisig platform supporting multiple blockchains. The platform enables asset management across chains from a single interface, leveraging the Internet Computer’s Chain Fusion for multichain interactions and vetKeys for signers privacy.

## High Level Architecture
<img width="7185" height="6096" alt="image" src="https://github.com/user-attachments/assets/3bd3c0a0-043d-4e1f-9f89-cf2dc0c246c8" />



# Running Q3x Locally

## Prerequisites

- **Node.js**: v22.16.0
- **pnpm**: v10.15.0
- **Docker**: For running PostgreSQL database
- **DFX**: Internet Computer SDK (dfx) for local development
- **Python3**: Required for account ID conversion

## Project Structure

```
q3x-icp-app/
├── apps/
│   ├── backend/          # NestJS backend application
│   └── frontend/         # Next.js frontend application
└── packages/
    ├── models/           # Shared models package
    └── prisma/           # Database schema and migrations
```

## Setup Instructions

### 1. Clone the Project

```bash
git clone git@github.com:Quantum3-Labs/q3x-icp-app.git
cd q3x-icp-app
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Database Setup

Start the PostgreSQL database using Docker:

```bash
cd apps/backend
docker compose up -d postgres
```

### 4. Build Prisma and Models

Navigate to the Prisma package and set up the database:

```bash
# From project root
cd packages/prisma
cp .env.example .env
pnpm migrate
pnpm generate
pnpm build
```

Build the models package:

```bash
cd ../models
pnpm build
```

### 5. Backend Setup (Terminal 1)

```bash
cd apps/backend
cp .env.example .env
pnpm generate:identity
```

**Important**: After running `pnpm generate:identity`, copy the generated private key to your `.env` file.

⚠️ **Stop here** - You need to run the local ICP replica first (see step 6).

### 6. Frontend and ICP Local Network Setup (Terminal 2)

#### Start DFX Local Network

```bash
cd apps/frontend
dfx start --clean --background
```

#### Create and Configure Identities

Create a minter identity:

```bash
dfx identity new minter --storage-mode plaintext
dfx identity use minter
export MINTER_ACCOUNT_ID=$(dfx ledger account-id)
```

Switch to default identity:

```bash
dfx identity use default
export DEFAULT_ACCOUNT_ID=$(dfx ledger account-id)
```

Display the account IDs:

```bash
printenv MINTER_ACCOUNT_ID
printenv DEFAULT_ACCOUNT_ID
```

#### Update dfx.json Configuration

Copy the account IDs and update `apps/frontend/dfx.json`:
- Replace `YOUR_MINT_ACCOUNT` with the `MINTER_ACCOUNT_ID`
- Replace `YOUR_DEFAULT_ACCOUNT` with the `DEFAULT_ACCOUNT_ID`
- Then run dfx deploy to deploy canister local

#### Frontend Environment Setup

```bash
cp .env.example .env
```

### 7. Run the Application

Now you can start both services:

**Frontend** (in `apps/frontend`):
```bash
pnpm dev
```

**Backend** (in `apps/backend`):
```bash
pnpm start
```

## ICP Local Transfer Setup

To transfer ICP tokens locally, you need to fund the backend wallet account:

### Get Backend Wallet Account ID

Replace the account ID below with your actual backend wallet account ID:

```bash
export Q3X_BACKEND_ACCOUNT_ID="1bf1f6e7030eea8e3f95075c2e941727f5543f02da5c7400722e521618b9daa7"
```

### Convert Account ID to Bytes Format

```bash
Q3X_BACKEND_ACCOUNT_ID_BYTES="$(python3 -c 'print("vec{" + ";".join([str(b) for b in bytes.fromhex("'$Q3X_BACKEND_ACCOUNT_ID'")]) + "}")')"
```

### Check Balance

```bash
dfx ledger balance $Q3X_BACKEND_ACCOUNT_ID
```

### Transfer ICP Tokens

Transfer 50 ICP tokens to the backend account:

```bash
dfx canister call icp_ledger_canister transfer "(record { to = ${Q3X_BACKEND_ACCOUNT_ID_BYTES}; memo = 1; amount = record { e8s = 50_00_000_000 }; fee = record { e8s = 10_000 }; })"
```

## Development Workflow

1. **Database Changes**: Make schema changes in `packages/prisma/schema.prisma`, then run migrations
2. **Backend Development**: Work in `apps/backend/src/`
3. **Frontend Development**: Work in `apps/frontend/src/`
4. **Shared Models**: Update models in `packages/models/src/`

## Troubleshooting

### Common Issues

- **Database Connection**: Ensure PostgreSQL is running via Docker
- **Identity Issues**: Make sure you've created and configured the minter and default identities
- **Port Conflicts**: Check if ports 3000, 4943, or 8000 are already in use
- **Environment Variables**: Verify all `.env` files are properly configured

### Useful Commands

```bash
# Check DFX status
dfx ping local

# List all identities
dfx identity list

# Check current identity
dfx identity whoami

# Stop local replica
dfx stop

# Clean restart
dfx start --clean --background
```

## Additional Resources

- [Internet Computer Documentation](https://internetcomputer.org/docs)
- [DFX CLI Reference](https://internetcomputer.org/docs/current/references/cli-reference/)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Next.js Documentation](https://nextjs.org/docs)

## Support

For issues and questions, please refer to the project's GitHub repository or contact the development team.
