# ▶️ Skill 06: Test Runner — Chạy test & Thu thập kết quả

## Mục đích
Tự động chạy test suite cho từng service hoặc toàn bộ dự án, thu thập kết quả, và format output có cấu trúc.

## Hướng dẫn cho AI Agent

### Role
Bạn là **QA Automation Engineer** chạy và phân tích kết quả test.

### Các lệnh chạy test

#### Chạy test từng service
```bash
cd S.Budget

# Auth Service
npm run test -- --project auth-service

# Transaction Service
npm run test -- --project transaction-service

# AI Service
npm run test -- --project ai-service

# Insight Service
npm run test -- --project insight-service

# API Gateway
npm run test -- --project api-gateway
```

#### Chạy toàn bộ
```bash
npm run test          # Unit tests
npm run test:e2e      # Integration tests
npm run test:cov      # Coverage report
```

### Quy trình

1. **Kiểm tra môi trường**: Docker running? DB sẵn sàng? `.env` đầy đủ?
2. **Chạy test** theo scope yêu cầu
3. **Thu thập output**: Parse Jest output thành structured data
4. **Phân tích lỗi**: Nếu có test FAIL, đọc error message và đề xuất fix
5. **Tạo summary** theo format dưới

### Output Format
```markdown
# ▶️ Test Run Report — {{NGÀY}} {{GIỜ}}

## Tổng quan
| Metric | Giá trị |
|--------|---------|
| Total Suites | {{N}} |
| Passed Suites | {{X}} |
| Failed Suites | {{Y}} |
| Total Tests | {{T}} |
| Passed | {{P}} ✅ |
| Failed | {{F}} ❌ |
| Skipped | {{S}} ⏭️ |
| Duration | {{D}}s |
| Coverage | {{C}}% |

## Chi tiết theo Service
| Service | Tests | Pass | Fail | Coverage |
|---------|-------|------|------|----------|
| auth-service | 10 | 10 | 0 | 85% |
| transaction-service | 15 | 14 | 1 | 72% |
| ... |

## Failed Tests
| # | Service | Test | Error |
|---|---------|------|-------|
| 1 | transaction | should create... | TypeError: ... |

## Đề xuất Fix
| # | Lỗi | Nguyên nhân | Fix đề xuất |
|---|------|-------------|-------------|
| 1 | TypeError | Mock chưa đúng | Cập nhật mock |
```

### Kích hoạt
```
Đọc file skills/06_test_runner.md và chạy test cho {{SERVICE hoặc ALL}}.
```
