# ✅ Skill 10: Deployment Health Checker

## Mục đích
Kiểm tra sức khỏe toàn bộ hệ thống sau khi deploy: services, databases, message queue, external APIs.

## Hướng dẫn cho AI Agent

### Role
Bạn là **SRE (Site Reliability Engineer)** giám sát hệ thống S.Budget.

### Checklist kiểm tra

#### 1. Docker Containers
```bash
# Kiểm tra tất cả containers đang chạy
docker-compose ps

# Expected: tất cả services ở trạng thái "Up"
# ✅ api-gateway      Up (healthy)
# ✅ auth-service      Up
# ✅ transaction-svc   Up
# ✅ ai-service        Up
# ✅ insight-service   Up
# ✅ postgres          Up
# ✅ rabbitmq          Up
```

#### 2. Service Health Endpoints
```bash
# API Gateway (port 3000)
curl -s http://localhost:3000/health | jq .
# Expected: { "status": "ok" }

# RabbitMQ Management (port 15672)
curl -s -u guest:guest http://localhost:15672/api/overview | jq .status
# Expected: "running"
```

#### 3. Database Connectivity
```bash
# Auth DB
docker exec postgres psql -U postgres -d auth_db -c "SELECT 1;"

# Transaction DB
docker exec postgres psql -U postgres -d transaction_db -c "SELECT 1;"

# Insight DB
docker exec postgres psql -U postgres -d insight_db -c "SELECT 1;"
```

#### 4. RabbitMQ Queues
```bash
# Kiểm tra queues đã được tạo
curl -s -u guest:guest http://localhost:15672/api/queues | jq '.[].name'
# Expected: auth_queue, transaction_queue, ai_queue, insight_queue
```

#### 5. End-to-End Smoke Test
```bash
# 1. Register
curl -s -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"healthcheck@test.com","password":"test123","name":"Health Check"}' | jq .

# 2. Login & get token
TOKEN=$(curl -s -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"healthcheck@test.com","password":"test123"}' | jq -r .accessToken)

# 3. Quick Add transaction
curl -s -X POST http://localhost:3000/api/v1/transactions/quick-add \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"text":"50k coffee test"}' | jq .

# 4. Get transactions
curl -s http://localhost:3000/api/v1/transactions \
  -H "Authorization: Bearer $TOKEN" | jq .
```

### Output Format
```markdown
# ✅ Deployment Health Report — {{NGÀY GIỜ}}

## Tổng quan: {{🟢 ALL GREEN / 🟡 DEGRADED / 🔴 CRITICAL}}

## Services Status
| Service | Port | Status | Response Time |
|---------|------|--------|---------------|
| API Gateway | 3000 | 🟢 Up | 12ms |
| Auth Service | 3001 | 🟢 Up | 8ms |
| Transaction Service | 3002 | 🟢 Up | 10ms |
| AI Service | 3003 | 🟢 Up | 15ms |
| Insight Service | 3004 | 🟢 Up | 9ms |
| PostgreSQL | 5432 | 🟢 Up | 3ms |
| RabbitMQ | 5672 | 🟢 Up | 5ms |

## Database Status
| Database | Tables | Rows | Status |
|----------|--------|------|--------|
| auth_db | users | {{N}} | 🟢 |
| transaction_db | transactions, categories | {{N}} | 🟢 |
| insight_db | spending_snapshots, ai_insights | {{N}} | 🟢 |

## Smoke Test Results
| Step | Endpoint | Status | Time |
|------|----------|--------|------|
| Register | POST /auth/register | ✅ 201 | 120ms |
| Login | POST /auth/login | ✅ 200 | 85ms |
| Quick Add | POST /transactions/quick-add | ✅ 201 | 2100ms |
| List | GET /transactions | ✅ 200 | 45ms |

## Issues Found
{{Nếu có vấn đề, liệt kê ở đây}}
```

### Auto Health Check Script
Tạo file `S.Budget/health-check.sh`:
```bash
#!/bin/bash
echo "🔍 S.Budget Health Check"
echo "========================"
services=("3000:API-Gateway" "3001:Auth" "3002:Transaction" "3003:AI" "3004:Insight")
for svc in "${services[@]}"; do
  port="${svc%%:*}"
  name="${svc##*:}"
  if curl -sf http://localhost:$port/health > /dev/null 2>&1; then
    echo "  ✅ $name (port $port) — UP"
  else
    echo "  ❌ $name (port $port) — DOWN"
  fi
done
```

### Kích hoạt
```
Đọc file skills/10_deployment_checker.md và kiểm tra health cho hệ thống S.Budget.
```
