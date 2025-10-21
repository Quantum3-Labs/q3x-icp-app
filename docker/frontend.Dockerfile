FROM node:22-alpine

# Accept build arguments
ARG NEXT_PUBLIC_NODE_ENV
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_REPLICA_URL_PROD
ARG NEXT_PUBLIC_CANISTER_ID_INTERNET_IDENTITY_PROD

# Set as environment variables
ENV NEXT_PUBLIC_NODE_ENV=$NEXT_PUBLIC_NODE_ENV
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_REPLICA_URL_PROD=$NEXT_PUBLIC_REPLICA_URL_PROD
ENV NEXT_PUBLIC_CANISTER_ID_INTERNET_IDENTITY_PROD=$NEXT_PUBLIC_CANISTER_ID_INTERNET_IDENTITY_PROD

RUN npm install -g pnpm
WORKDIR /app

# Copy everything
COPY . .

# Install dependencies
RUN pnpm install

# Build shared packages
RUN pnpm --filter @q3x/prisma generate
RUN pnpm --filter @q3x/prisma build
RUN pnpm --filter @q3x/models build

# Build frontend
RUN pnpm --filter frontend build

# Set working directory
WORKDIR /app/apps/frontend

EXPOSE 3000
CMD ["pnpm", "start"]