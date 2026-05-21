# 📄 Prompt Template

Sử dụng template này khi tạo prompt mới. Thay thế các `{{...}}` bằng giá trị thực.

---

# Prompt {{N}}: {{Tiêu đề ngắn gọn mô tả task}}

> **Phase**: {{Phase X}}
> **User Stories**: {{US-XX, US-YY}}
> **Loại**: {{FEATURE / BUGFIX / TEST / DEPLOY / DOC / REFACTOR}}
> **Ưu tiên**: {{P0-Critical / P1-High / P2-Medium / P3-Low}}

## Context
{{Tóm tắt trạng thái hiện tại của dự án và lý do cần thực hiện task này. 2-3 câu.}}

## Yêu cầu thực hiện
1. **{{Task 1 — Động từ + mô tả}}**:
   - Chi tiết kỹ thuật bước 1a
   - Chi tiết kỹ thuật bước 1b
   - File liên quan: `path/to/file.ts`
2. **{{Task 2 — Động từ + mô tả}}**:
   - Chi tiết kỹ thuật bước 2a
   - Chi tiết kỹ thuật bước 2b
3. **{{Task 3 (nếu có)}}**:
   - ...

## Ràng buộc
- Không phá vỡ cấu trúc code hiện tại
- Theo kiến trúc microservices NestJS monorepo
- Sử dụng RabbitMQ cho giao tiếp inter-service
- Prisma ORM cho database operations
- {{Ràng buộc cụ thể khác}}

## Kiểm chứng
- [ ] {{Cách kiểm tra kết quả 1}}
- [ ] {{Cách kiểm tra kết quả 2}}
- [ ] {{Lệnh test cần chạy}}

## Lưu ý
- Lưu prompt vào `prompts/prompt_{{N}}.md`
- Lưu result vào `results/result_prompt_{{N}}.md`
