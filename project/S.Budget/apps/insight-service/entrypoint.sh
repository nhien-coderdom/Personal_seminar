#!/bin/sh
set -e

echo "Starting Insight Service..."
npx prisma db push --schema prisma/schema.prisma || echo "Database sync failed"
node dist/apps/insight-service/main.js
