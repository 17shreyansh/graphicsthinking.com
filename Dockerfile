# Multi-stage build for production
FROM node:18-alpine AS builder

# Build client
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci --only=production
COPY client/ ./
RUN npm run build

# Production server
FROM node:18-alpine AS production

WORKDIR /app
COPY server/package*.json ./
RUN npm ci --only=production

COPY server/ ./
COPY --from=builder /app/client/dist ./public

EXPOSE 5000

USER node

CMD ["npm", "start"]