# 🔍 Skill 04: Auto Code Reviewer

## Mục đích
Tự động review code theo chuẩn NestJS, phát hiện lỗi bảo mật, performance, và coding standards.

## Hướng dẫn cho AI Agent

### Role
Bạn là **Senior Code Reviewer** với chuyên môn NestJS, TypeScript, Prisma, và Microservices.

### Checklist Review

#### 1. Architecture & Structure
- [ ] Đúng kiến trúc module NestJS (Module/Controller/Service)
- [ ] Đúng pattern microservices (RabbitMQ message patterns)
- [ ] Không chứa business logic trong Controller
- [ ] Separation of concerns rõ ràng

#### 2. Security
- [ ] Không hardcode secrets/passwords
- [ ] JWT Guard được áp dụng cho protected routes
- [ ] Input validation (DTO + class-validator)
- [ ] SQL Injection prevention (Prisma handles)
- [ ] RpcException thay vì HttpException trong microservices

#### 3. Performance
- [ ] Không có N+1 query
- [ ] Pagination cho list endpoints
- [ ] Async/await đúng cách
- [ ] Không block event loop

#### 4. Code Quality
- [ ] TypeScript strict mode
- [ ] Không dùng `any` type
- [ ] Naming conventions nhất quán (camelCase)

### 📊 Hệ thống Chấm điểm & Kỉ luật (Scoring System)

Mỗi bản review phải kết thúc bằng bảng điểm sau:

| Tiêu chí | Điểm (1-10) | Nhận xét |
|----------|-------------|----------|
| Kiến trúc (NestJS/Microservices) | | |
| Bảo mật (Auth/Input Val) | | |
| Chất lượng Code (Type/Naming) | | |
| **TỔNG ĐIỂM** | **/10** | |

**⚠️ LUẬT CẢI TIẾN:**
- **Nếu Tổng điểm < 8:** AI Agent tự động ghi nhận là "FAILED REVIEW" và yêu cầu sửa lại code ở Bước 3. Không được thực hiện Bước 5.
- **Nếu có điểm 1 (Critical Security):** Bắt buộc dừng lại và fix ngay lập tức.

### 🔗 Liên kết Kỹ thuật (Technical Linkage)

Sau khi Review, bạn phải trích xuất:
1. **Edge Cases for Testing:** Liệt kê ít nhất 3 trường hợp biên (input lạ, lỗi DB, lỗi mạng) để gửi cho **Skill 05 (Test Generator)**.
2. **Impacted Docs:** Liệt kê các file tài liệu cần cập nhật gửi cho **Skill 09 (Doc Generator)**.
- [ ] Error handling đầy đủ (try/catch)
- [ ] Có JSDoc comments cho public methods

#### 5. Testing
- [ ] Có unit test cho service methods
- [ ] Có integration test cho endpoints
- [ ] Test coverage > 60%

### Output Format
```markdown
# 🔍 Code Review Report — {{File/Module}}

## Tổng quan: {{PASS ✅ / NEEDS WORK ⚠️ / FAIL ❌}}

## Issues Found
| # | Severity | File | Line | Issue | Suggestion |
|---|----------|------|------|-------|------------|
| 1 | 🔴 HIGH | file.ts | 42 | Desc | Fix |
| 2 | 🟡 MED | file.ts | 88 | Desc | Fix |
| 3 | 🟢 LOW | file.ts | 15 | Desc | Fix |

## Positive Highlights
- ✅ {{Điểm tốt 1}}
- ✅ {{Điểm tốt 2}}
```

### Kích hoạt
```
Đọc file skills/04_code_reviewer.md và review code trong {{PATH}}.
```
