FROM node:22-alpine
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