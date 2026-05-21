# 📝 Skill 02: Auto Result Recorder

## Mục đích
Tự động ghi lại kết quả sau mỗi bước thực hiện. Đảm bảo mọi hành động đều được ghi log đầy đủ, có cấu trúc, dễ truy vết.

## Input
```
{{SỐ THỨ TỰ PROMPT}} (ví dụ: 23)
{{TÓM TẮT CÔNG VIỆC ĐÃ LÀM}}
{{DANH SÁCH FILE ĐÃ THAY ĐỔI}}
{{KẾT QUẢ TEST (nếu có)}}
{{LỖI GẶP PHẢI (nếu có)}}
```

## Hướng dẫn cho AI Agent

### Role
Bạn là **Technical Writer** chuyên ghi chép kết quả phát triển phần mềm. Nhiệm vụ là tạo file result có cấu trúc chuẩn sau mỗi phiên làm việc.

### Quy trình
1. **Thu thập thông tin** từ phiên làm việc:
   - Đọc prompt tương ứng (`prompts/prompt_{{N}}.md`).
   - Liệt kê file đã tạo/sửa/xóa.
   - Ghi nhận lệnh đã chạy và output.
2. **Kiểm tra dữ liệu bắt buộc (Mandatory Checklist):**
   - **Review Status:** Điểm số (X/10) và Trạng thái (PASSED/FAILED) từ Skill 04.
   - **Test Evidence:** Coverage và Tỉ lệ pass từ Skill 07.
   - **Documentation Status:** Xác nhận đã cập nhật tài liệu qua Skill 09.
3. **Tạo file result** theo template chuẩn.
4. **Lưu file** vào `results/result_prompt_{{N}}.md`.

### Output Format

```markdown
# Result Prompt {{N}}

## 1. Mục tiêu
{{Tóm tắt mục tiêu từ prompt tương ứng — 1-2 câu}}

## 2. Các thay đổi đã thực hiện

### Files đã tạo mới
| # | File | Mô tả |
|---|------|-------|
| 1 | `path/to/new/file.ts` | {{Mô tả ngắn}} |

### Files đã chỉnh sửa
| # | File | Thay đổi |
|---|------|----------|
| 1 | `path/to/modified/file.ts` | {{Mô tả thay đổi}} |

### Lệnh đã chạy
```bash
{{lệnh 1}}
{{lệnh 2}}
```

## 3. Kết quả kiểm thử
| Test | Trạng thái | Ghi chú |
|------|-----------|---------|
| {{Test name}} | ✅ PASS / ❌ FAIL | {{Chi tiết}} |

## 4. Vấn đề gặp phải & Cách giải quyết
| # | Vấn đề | Giải pháp |
|---|--------|-----------|
| 1 | {{Mô tả lỗi}} | {{Cách fix}} |

## 5. Trạng thái User Stories
| US | Tên | Trạng thái |
|----|-----|-----------|
| US-XX | {{Tên}} | ✅ Done / 🔄 In Progress / ⬜ Not Started |

## 6. Bước tiếp theo
- {{Việc cần làm tiếp 1}}
- {{Việc cần làm tiếp 2}}
```

### Auto-trigger Rules

Skill này nên được kích hoạt **tự động** sau khi:
- ✅ Hoàn thành một prompt
- ✅ Kết thúc một phiên code
- ✅ Chạy xong test suite
- ✅ Deploy thành công hoặc thất bại
- ✅ Fix xong một bug

### Cách kích hoạt

```
Đọc file `skills/02_result_recorder.md` và ghi kết quả cho prompt số {{N}}.

Tóm tắt công việc đã làm:
{{MÔ TẢ NGẮN}}
```
