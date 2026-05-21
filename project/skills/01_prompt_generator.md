# ✏️ Skill 01: Auto Prompt Generator

## Mục đích
Tự động tạo prompt có cấu trúc chuẩn từ yêu cầu thô của người dùng. Đảm bảo tất cả prompt đều theo format nhất quán và đầy đủ context.

## Input
```
{{YÊU CẦU THÔ TỪ NGƯỜI DÙNG}}
{{SỐ THỨ TỰ PROMPT TIẾP THEO}} (ví dụ: 23)
{{PHASE HIỆN TẠI}} (ví dụ: Phase 4)
{{USER STORIES LIÊN QUAN}} (ví dụ: US-12, US-13)
```

## Hướng dẫn cho AI Agent

### Role
Bạn là **Prompt Engineer** chuyên nghiệp. Nhiệm vụ là biến yêu cầu thô thành prompt rõ ràng, có cấu trúc, dễ thực thi.

### Quy trình

1. **Đọc yêu cầu thô** từ người dùng
2. **Đọc context hiện tại**:
   - Đọc `implementation_plan.md` để hiểu tổng thể dự án
   - Đọc prompt gần nhất trong `prompts/` để biết tiến độ
   - Đọc result gần nhất trong `results/` để biết trạng thái
3. **Phân tích & chia nhỏ** yêu cầu thành các bước cụ thể
4. **Tạo prompt** theo template chuẩn (xem `templates/prompt_template.md`)
5. **Lưu file** vào `prompts/prompt_{{N}}.md`

### Nguyên tắc viết prompt tốt

- ✅ **Rõ ràng**: Mỗi bước phải có input/output cụ thể
- ✅ **Có context**: Nhắc nhở AI về kiến trúc hiện tại (NestJS, microservices, RabbitMQ...)
- ✅ **Có ràng buộc**: "Không phá code hiện tại", "Theo cấu trúc module hiện có"
- ✅ **Có liên kết**: Gắn với User Story cụ thể (US-XX)
- ✅ **Có kiểm chứng**: Mô tả cách test kết quả
- ❌ **Tránh mơ hồ**: "Làm cho tốt hơn" → thay bằng "Tối ưu query N+1 trong TransactionService"
- ❌ **Tránh quá rộng**: 1 prompt = 1 task rõ ràng, không gộp 5 việc vào 1

### Auto-detect loại prompt

Dựa vào nội dung yêu cầu, tự chọn template phù hợp:

| Pattern trong yêu cầu | Loại prompt | Template |
|------------------------|-------------|----------|
| "tạo", "xây dựng", "implement" | Feature Development | `[FEATURE]` |
| "fix", "sửa", "lỗi", "bug" | Bug Fix | `[BUGFIX]` |
| "test", "kiểm tra" | Testing | `[TEST]` |
| "deploy", "triển khai" | Deployment | `[DEPLOY]` |
| "viết báo cáo", "chương" | Documentation | `[DOC]` |
| "refactor", "tối ưu" | Refactoring | `[REFACTOR]` |
| "review", "đánh giá" | Review | `[REVIEW]` |

### Output Format

```markdown
# Prompt {{N}}: {{Tiêu đề mô tả ngắn gọn}}

> Phase: {{Phase hiện tại}}
> User Stories: {{US-XX, US-YY}}
> Loại: {{FEATURE / BUGFIX / TEST / DEPLOY / DOC / REFACTOR}}

## Context
{{Mô tả ngắn về trạng thái hiện tại của dự án}}

## Yêu cầu thực hiện
1. **{{Task 1 title}}**:
   - Chi tiết bước 1a
   - Chi tiết bước 1b
2. **{{Task 2 title}}**:
   - Chi tiết bước 2a
   - Chi tiết bước 2b

## Ràng buộc
- Không phá vỡ cấu trúc code hiện tại
- Theo kiến trúc microservices (NestJS monorepo)
- {{Ràng buộc cụ thể khác}}

## Kiểm chứng
- {{Cách kiểm tra kết quả 1}}
- {{Cách kiểm tra kết quả 2}}

## Lưu ý
- Lưu prompt vào `prompts/prompt_{{N}}.md`
- Lưu result vào `results/result_prompt_{{N}}.md`
```

### Cách kích hoạt

```
Đọc file `skills/01_prompt_generator.md` và tạo prompt mới cho yêu cầu sau:

{{YÊU CẦU CỦA BẠN}}

Prompt tiếp theo là số: {{N}}
Phase hiện tại: {{Phase X}}
```
