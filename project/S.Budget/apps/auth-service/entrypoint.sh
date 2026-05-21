#!/bin/sh
set -e

echo "Starting Auth Service..."
npx prisma db push --schema prisma/schema.prisma || echo "Database sync failed"
node dist/apps/auth-service/main.js
