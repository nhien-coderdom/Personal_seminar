# 📄 Result Template

Sử dụng template này khi ghi kết quả. Thay thế các `{{...}}` bằng giá trị thực.

---

# Result Prompt {{N}}

## 1. Mục tiêu
{{Tóm tắt mục tiêu từ prompt tương ứng — 1-2 câu ngắn gọn}}

## 2. Các thay đổi đã thực hiện

### Files đã tạo mới
| # | File | Mô tả |
|---|------|-------|
| 1 | `{{path/to/new/file.ts}}` | {{Mô tả chức năng}} |
| 2 | `{{path/to/new/file2.ts}}` | {{Mô tả chức năng}} |

### Files đã chỉnh sửa
| # | File | Thay đổi |
|---|------|----------|
| 1 | `{{path/to/modified.ts}}` | {{Mô tả thay đổi cụ thể}} |

### Dependencies đã thêm
```bash
npm install {{package1}} {{package2}}
```

### Lệnh đã chạy
```bash
{{lệnh 1 và output tóm tắt}}
{{lệnh 2 và output tóm tắt}}
```

## 3. Kết quả kiểm thử
| # | Test Case | Loại | Trạng thái | Ghi chú |
|---|-----------|------|-----------|---------|
| 1 | {{Tên test}} | Unit/API | ✅ PASS | — |
| 2 | {{Tên test}} | Unit/API | ❌ FAIL | {{Lý do}} |

## 4. Vấn đề gặp phải & Cách giải quyết
| # | Vấn đề | Nguyên nhân | Giải pháp |
|---|--------|-------------|-----------|
| 1 | {{Mô tả lỗi}} | {{Root cause}} | {{Cách fix}} |

## 5. Trạng thái User Stories
| US | Tên | Trạng thái |
|----|-----|-----------|
| US-{{XX}} | {{Tên}} | ✅ Done / 🔄 In Progress / ⬜ Not Started |

## 6. Bước tiếp theo
- [ ] {{Việc cần làm tiếp 1}}
- [ ] {{Việc cần làm tiếp 2}}
