#!/bin/sh
set -e

echo "Starting Transaction Service..."
npx prisma db push --schema prisma/schema.prisma || echo "Database sync failed"
node dist/apps/transaction-service/main.js
