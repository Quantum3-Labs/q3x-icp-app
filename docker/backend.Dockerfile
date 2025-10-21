FROM node:22-alpine
RUN npm install -g pnpm
WORKDIR /app

# Copy everything
COPY . .

# Install dependencies
RUN pnpm install

# Generate and build
RUN pnpm --filter @q3x/prisma generate
RUN pnpm --filter @q3x/prisma build  
RUN pnpm --filter @q3x/models build
RUN pnpm --filter backend build

# Set working directory
WORKDIR /app/apps/backend

EXPOSE 4000
CMD ["sh", "-c", "cd /app/packages/prisma && npx prisma migrate deploy && cd /app/apps/backend && pnpm start:prod"]