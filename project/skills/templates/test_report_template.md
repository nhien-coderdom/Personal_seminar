# 📄 Test Report Template

---

# 📋 Test Report — S.Budget {{Phase/Sprint/Version}}

## 1. Thông tin chung
| Mục | Chi tiết |
|-----|---------|
| Dự án | S.Budget — Hệ thống quản lý tài chính cá nhân |
| Phiên bản | v{{X.Y.Z}} |
| Ngày test | {{YYYY-MM-DD}} |
| Người thực hiện | {{Tên}} |
| Môi trường | {{Local Docker / Staging / Production}} |
| Tools | Jest, Postman, Docker |

## 2. Phạm vi kiểm thử
| Service | Unit Test | Integration Test | Manual Test |
|---------|-----------|-----------------|-------------|
| Auth Service | {{N}} TCs | {{N}} TCs | {{N}} TCs |
| Transaction Service | {{N}} TCs | {{N}} TCs | {{N}} TCs |
| AI Service | {{N}} TCs | {{N}} TCs | {{N}} TCs |
| Insight Service | {{N}} TCs | {{N}} TCs | {{N}} TCs |
| **Tổng** | **{{T1}}** | **{{T2}}** | **{{T3}}** |

## 3. Kết quả tổng hợp

### Tổng quan
| Metric | Số lượng | Tỷ lệ |
|--------|---------|--------|
| ✅ Passed | {{P}} | {{%}} |
| ❌ Failed | {{F}} | {{%}} |
| 🚫 Blocked | {{B}} | {{%}} |
| ⏭️ Skipped | {{S}} | {{%}} |
| **Tổng** | **{{TOTAL}}** | **100%** |

### Code Coverage
| Service | Statements | Branches | Functions | Lines |
|---------|-----------|----------|-----------|-------|
| auth-service | {{%}} | {{%}} | {{%}} | {{%}} |
| transaction-service | {{%}} | {{%}} | {{%}} | {{%}} |
| ai-service | {{%}} | {{%}} | {{%}} | {{%}} |
| insight-service | {{%}} | {{%}} | {{%}} | {{%}} |

## 4. Chi tiết Test Cases

### Auth Service
| TC-ID | Mô tả | Type | Precondition | Input | Expected | Actual | Status |
|-------|--------|------|-------------|-------|----------|--------|--------|
| AUTH-01 | {{Desc}} | {{Unit/API}} | {{Pre}} | {{Input}} | {{Expected}} | {{Actual}} | ✅/❌ |

### Transaction Service
| TC-ID | Mô tả | Type | Precondition | Input | Expected | Actual | Status |
|-------|--------|------|-------------|-------|----------|--------|--------|
| TXN-01 | {{Desc}} | {{Unit/API}} | {{Pre}} | {{Input}} | {{Expected}} | {{Actual}} | ✅/❌ |

### AI Service
| TC-ID | Mô tả | Type | Precondition | Input | Expected | Actual | Status |
|-------|--------|------|-------------|-------|----------|--------|--------|
| AI-01 | {{Desc}} | {{Unit/API}} | {{Pre}} | {{Input}} | {{Expected}} | {{Actual}} | ✅/❌ |

### Insight Service
| TC-ID | Mô tả | Type | Precondition | Input | Expected | Actual | Status |
|-------|--------|------|-------------|-------|----------|--------|--------|
| INS-01 | {{Desc}} | {{Unit/API}} | {{Pre}} | {{Input}} | {{Expected}} | {{Actual}} | ✅/❌ |

## 5. Bugs Found
| Bug-ID | Severity | Mô tả | Service | Steps to Reproduce | Status |
|--------|----------|-------|---------|---------------------|--------|
| BUG-{{N}} | 🔴/🟡/🟢 | {{Desc}} | {{Svc}} | {{Steps}} | Fixed/Open |

## 6. Kết luận
- **Chất lượng tổng thể**: {{Tốt / Trung bình / Cần cải thiện}}
- **Sẵn sàng release**: {{Có / Có điều kiện / Không}}
- **Rủi ro**: {{Mô tả rủi ro nếu có}}

## 7. Đề xuất
1. {{Đề xuất 1}}
2. {{Đề xuất 2}}
