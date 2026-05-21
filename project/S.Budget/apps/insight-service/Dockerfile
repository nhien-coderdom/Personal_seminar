FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate --schema apps/insight-service/prisma/schema.prisma
RUN npx nest build insight-service

FROM node:20-alpine AS production
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY apps/insight-service/prisma ./prisma
COPY apps/insight-service/entrypoint.sh ./entrypoint.sh
RUN chmod +x /app/entrypoint.sh
EXPOSE 3004
CMD ["/app/entrypoint.sh"]
