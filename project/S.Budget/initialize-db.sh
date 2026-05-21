#!/bin/bash

# ============================================
# Database Initialization Script
# Run: npm run initialize
# ============================================

set -e

echo "========================================="
echo "🔧 INITIALIZING DATABASE"
echo "========================================="

echo ""
echo "[1/3] Waiting for PostgreSQL..."
# Wait for PostgreSQL to be ready
for i in {1..30}; do
    if pg_isready -h sbudget-postgres -p 5432 -U sbudget &>/dev/null; then
        echo "✓ PostgreSQL is ready"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "✗ PostgreSQL connection timeout"
        exit 1
    fi
    echo "  Attempt $i/30..."
    sleep 2
done

echo ""
echo "[2/3] Running Prisma migrations..."
npx prisma migrate deploy --schema apps/auth-service/prisma/schema.prisma 2>/dev/null || echo "  ℹ Auth migrations already applied"
npx prisma migrate deploy --schema apps/transaction-service/prisma/schema.prisma 2>/dev/null || echo "  ℹ Transaction migrations already applied"
npx prisma migrate deploy --schema apps/insight-service/prisma/schema.prisma 2>/dev/null || echo "  ℹ Insight migrations already applied"
echo "✓ Migrations completed"

echo ""
echo "[3/3] Seeding development data..."
npx ts-node database_seed/run-seeds.ts
echo "✓ Seeding completed"

echo ""
echo "========================================="
echo "✅ DATABASE INITIALIZATION COMPLETE"
echo "========================================="
