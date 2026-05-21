#!/bin/bash
# ====================================================
# S.Budget Production Deployment Script
# ====================================================

echo "🚀 Starting Deployment Process for S.Budget..."

# 1. (Tùy chọn) Kéo code mới nhất từ Git (Nếu chạy trên server thực)
# echo "📥 Pulling latest code..."
# git pull origin main

# 2. Xây dựng lại các Docker images (dùng docker-compose.yml mặc định hoặc docker-compose.prod.yml)
echo "📦 Building Docker images (No Cache)..."
docker-compose build

# 3. Khởi động hệ thống ở chế độ ẩn (Detached Mode)
echo "🔄 Starting services..."
docker-compose up -d

# 4. Xóa rác hệ thống (Dọn dẹp các images lơ lửng)
echo "🧹 Cleaning up unused Docker resources..."
docker image prune -f

echo "✅ Deployment completed successfully!"
echo "👉 Run './health-check.sh' to verify service status."
