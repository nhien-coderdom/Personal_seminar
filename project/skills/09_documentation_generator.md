# 📖 Skill 09: Documentation Generator

## Mục đích
Tự động sinh tài liệu kỹ thuật, API docs, và nội dung báo cáo đồ án từ source code và kết quả thực tế.

## Hướng dẫn cho AI Agent

### Role
Bạn là **Technical Writer** kiêm **Hướng dẫn viên luận văn CNTT**.

### Các loại tài liệu có thể sinh

#### 1. API Documentation (Swagger-style)
Quét tất cả controllers trong `S.Budget/apps/api-gateway/src/` và sinh bảng API:

```markdown
## API Endpoints

### Auth Service
| Method | Endpoint | Mô tả | Auth | Body |
|--------|----------|-------|------|------|
| POST | /api/v1/auth/register | Đăng ký | ❌ | { email, password, name } |
| POST | /api/v1/auth/login | Đăng nhập | ❌ | { email, password } |

### Transaction Service
| Method | Endpoint | Mô tả | Auth | Body |
|--------|----------|-------|------|------|
| POST | /api/v1/transactions/quick-add | Quick Add NLP | ✅ JWT | { text } |
| POST | /api/v1/transactions/upload-image | Upload ảnh OCR | ✅ JWT | form-data: file |
| GET | /api/v1/transactions | Danh sách GD | ✅ JWT | — |
| PUT | /api/v1/transactions/:id | Sửa GD | ✅ JWT | { amount, categoryId, note } |
| DELETE | /api/v1/transactions/:id | Xóa GD (soft) | ✅ JWT | — |
| GET | /api/v1/categories | Danh mục | ✅ JWT | — |

### Insight Service
| Method | Endpoint | Mô tả | Auth | Body |
|--------|----------|-------|------|------|
| GET | /api/v1/insights/stats | Thống kê | ✅ JWT | ?month=YYYY-MM |
| GET | /api/v1/insights/behavior | Hành vi | ✅ JWT | — |
| GET | /api/v1/insights/recommendations | Gợi ý AI | ✅ JWT | — |
```

#### 2. Database Schema Documentation
Quét `prisma/schema.prisma` trong mỗi service và sinh:
- ERD diagram (Mermaid)
- Mô tả từng bảng và cột
- Mối quan hệ giữa các bảng

#### 3. Architecture Documentation
Sinh sơ đồ kiến trúc:
- System Architecture Diagram
- Sequence Diagrams cho các flow chính
- Component Diagram
- Data Flow Diagram (DFD)

#### 4. Nội dung Báo cáo Đồ án
Sinh nội dung cho các chương:
- Chương 1: Tổng quan đề tài (bối cảnh, mục tiêu, phạm vi)
- Chương 2: Cơ sở lý thuyết (microservices, API Gateway, JWT, ORM, Docker)
- Chương 3: Phân tích thiết kế (Use Case, ERD, Sequence, DFD)
- Chương 4: Hiện thực (screenshots, code snippets, test results)
- Chương 5: Kết luận & hướng phát triển

### 🔄 Quy trình Cải tiến: Cập nhật Lũy tiến (Incremental Update)

Thay vì viết lại toàn bộ tài liệu, hãy thực hiện theo kỹ thuật **"Scan - Compare - Patch"**:

1. **Scan:** Đọc file tài liệu hiện có (ví dụ `README.md` hoặc `API_Docs.md`).
2. **Compare:** So sánh với Code mới và `result_{N+1}.md` để tìm sự khác biệt.
3. **Patch:** Chỉ ghi đè hoặc chèn thêm nội dung vào các phần bị thay đổi.

### 🔗 Liên kết Dữ liệu (Data Linkage)

AI phải sử dụng bằng chứng từ các skill khác để viết tài liệu:
- **Từ Skill 07 (Test Report):** Lấy screenshot hoặc log kết quả test để đưa vào phần "Verification".
- **Từ Skill 10 (Deployment):** Lấy URL health-check hoặc trạng thái container để làm bằng chứng "Production-ready".

### 📋 Checklist kỉ thuật cho Tài liệu:
- [ ] Có sơ đồ Sequence cho các luồng mới (sử dụng Mermaid).
- [ ] API Table cập nhật đúng Path, Method và Request Body.
- [ ] ERD Diagram cập nhật nếu có thay đổi Model Prisma.
