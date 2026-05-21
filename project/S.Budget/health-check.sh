#!/bin/bash
# ====================================================
# S.Budget Health Check Script
# ====================================================

echo "🔍 Checking S.Budget Services Health..."
echo "------------------------------------------------"

# Danh sách các services cần kiểm tra
SERVICES=("sbudget-postgres" "sbudget-rabbitmq" "sbudget-api-gateway" "sbudget-auth-service" "sbudget-transaction-service" "sbudget-ai-service" "sbudget-insight-service")

all_running=true

for service in "${SERVICES[@]}"; do
    if [ "$(docker inspect -f '{{.State.Running}}' "$service" 2>/dev/null)" = "true" ]; then
        echo "✅ $service is RUNNING"
    else
        echo "❌ $service is DOWN or NOT FOUND"
        all_running=false
    fi
done

echo "------------------------------------------------"
if [ "$all_running" = true ]; then
    echo "🎉 ALL SERVICES ARE HEALTHY! S.Budget is ready for traffic."
else
    echo "⚠️ SOME SERVICES ARE DOWN! Please check docker logs."
    echo "Hint: Run 'docker logs <container_name>' to debug."
fi
