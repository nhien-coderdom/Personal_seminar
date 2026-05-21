# 📋 Skill 07: Test Report Generator

## Mục đích
Tổng hợp kết quả test từ nhiều lần chạy thành một Test Report chuyên nghiệp, phù hợp để nộp báo cáo đồ án hoặc gửi cho stakeholders.

## Hướng dẫn cho AI Agent

### Role
Bạn là **QA Lead** tổng hợp báo cáo kiểm thử cho dự án S.Budget.

### Quy trình
1. Đọc toàn bộ test results từ `results/` (các file có chứa thông tin test)
2. Đọc `TESTING_GUIDE.md` để hiểu quy trình test hiện tại
3. Tổng hợp theo từng Phase và User Story
4. Đánh giá chất lượng tổng thể
5. Lưu report vào `results/test_report_{{phase}}.md`

### Output Format
```markdown
# 📋 Test Report — S.Budget {{Phase/Sprint}}

## 1. Thông tin chung
| Mục | Chi tiết |
|-----|---------|
| Dự án | S.Budget — Hệ thống quản lý tài chính cá nhân |
| Phiên bản | v{{X.Y.Z}} |
| Ngày test | {{YYYY-MM-DD}} |
| Người thực hiện | {{Tên}} |
| Môi trường | Local Docker / Staging / Production |
| Tool | Jest, Postman, Docker |

## 2. Phạm vi kiểm thử
| Service | Loại test | Số lượng TC | Đã chạy |
|---------|-----------|-------------|---------|
| Auth Service | Unit + API | {{N}} | ✅ |
| Transaction Service | Unit + API | {{N}} | ✅ |
| AI Service | Unit + API | {{N}} | ✅ |
| Insight Service | Unit + API | {{N}} | ✅ |
| API Gateway | Integration | {{N}} | ✅ |

## 3. Kết quả tổng hợp
| Metric | Giá trị |
|--------|---------|
| Tổng Test Cases | {{TOTAL}} |
| Passed ✅ | {{PASS}} ({{%}}) |
| Failed ❌ | {{FAIL}} ({{%}}) |
| Blocked 🚫 | {{BLOCK}} |
| Not Run ⬜ | {{NOTRUN}} |

## 4. Chi tiết Test Cases

### 4.1 Auth Service (US-15, US-16)
| TC-ID | Mô tả | Loại | Input | Expected | Actual | Status |
|-------|--------|------|-------|----------|--------|--------|
| AUTH-01 | Register thành công | API | Valid email/pass | 201 + user | 201 + user | ✅ |
| AUTH-02 | Register email trùng | API | Existing email | 409 Conflict | 409 | ✅ |
| AUTH-03 | Login đúng | API | Correct creds | 200 + JWT | 200 + JWT | ✅ |
| AUTH-04 | Login sai mật khẩu | API | Wrong pass | 401 | 401 | ✅ |

### 4.2 Transaction Service (US-01, US-09-11)
| TC-ID | Mô tả | Loại | Input | Expected | Actual | Status |
|-------|--------|------|-------|----------|--------|--------|
| TXN-01 | Quick Add "80k cafe" | API | text: "80k cafe" | amount=80000 | 80000 | ✅ |
| TXN-02 | List transactions | API | GET + JWT | Array | Array | ✅ |
| ... |

### 4.3 AI Service (US-02, US-05-07)
...

### 4.4 Insight Service (US-12-14)
...

## 5. Bugs Found
| Bug-ID | Severity | Mô tả | Service | Status | Fix |
|--------|----------|-------|---------|--------|-----|
| BUG-01 | 🔴 Critical | Desc | Service | Fixed ✅ | PR #X |
| BUG-02 | 🟡 Medium | Desc | Service | Open 🔄 | — |

## 6. Kết luận & Đánh giá
- **Chất lượng tổng thể**: {{TỐT / TRUNG BÌNH / CẦN CẢI THIỆN}}
- **Sẵn sàng release**: {{CÓ / KHÔNG}}
- **Rủi ro còn tồn tại**: {{Mô tả}}

## 7. Đề xuất
1. {{Đề xuất cải thiện 1}}
2. {{Đề xuất cải thiện 2}}
```

### Kích hoạt
```
Đọc file skills/07_test_report_generator.md và tạo test report cho Phase {{X}}.
```
