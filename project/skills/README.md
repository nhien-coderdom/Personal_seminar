# 🧠 Vibe-Coding Skills System — S.Budget

Hệ thống Skill/Prompt tự động hóa toàn bộ vòng đời phát triển phần mềm cho dự án S.Budget.

## Tổng quan

Mỗi file `.md` trong thư mục `skills/` là một **Skill** — tức là một prompt có cấu trúc, được thiết kế để AI Agent (Gemini, Claude, GPT, Cursor, Copilot...) có thể đọc và thực thi tự động.

## Cấu trúc Skill

```
skills/
├── README.md                         # File này
├── 00_master_orchestrator.md         # 🎯 Skill điều phối tổng — chuỗi hóa mọi skill
├── 01_prompt_generator.md            # ✏️ Auto tạo prompt từ yêu cầu
├── 02_result_recorder.md             # 📝 Auto ghi kết quả sau mỗi bước
├── 03_progress_tracker.md            # 📊 Kiểm tra & báo cáo tiến độ
├── 04_code_reviewer.md               # 🔍 Auto code review
├── 05_test_case_generator.md         # 🧪 Sinh test case tự động
├── 06_test_runner.md                 # ▶️ Chạy test & thu thập kết quả
├── 07_test_report_generator.md       # 📋 Tạo test report
├── 08_cicd_pipeline.md               # 🚀 Thiết lập & chạy CI/CD
├── 09_documentation_generator.md     # 📖 Sinh tài liệu tự động
├── 10_deployment_checker.md          # ✅ Kiểm tra deployment health
└── templates/
    ├── prompt_template.md            # Template chuẩn cho prompt
    ├── result_template.md            # Template chuẩn cho result
    ├── test_report_template.md       # Template cho test report
    └── progress_report_template.md   # Template cho progress report
```

## Cách sử dụng

### 1. Sử dụng trực tiếp
Copy nội dung skill và paste vào AI chat tool. Thay thế các `{{PLACEHOLDER}}` bằng giá trị thực tế.

### 2. Sử dụng chuỗi (Chain)
Dùng `00_master_orchestrator.md` để AI tự động chạy tuần tự nhiều skill.

### 3. Tích hợp CI/CD
Dùng `08_cicd_pipeline.md` để tạo GitHub Actions workflows tự động.

## Quy ước đặt tên

| Loại | Format | Ví dụ |
|------|--------|-------|
| Prompt | `prompt_{số}.md` | `prompt_23.md` |
| Result | `result_prompt_{số}.md` | `result_prompt_23.md` |
| Test Report | `test_report_{phase}.md` | `test_report_phase_1.md` |
| Progress | `progress_{ngày}.md` | `progress_2026-05-07.md` |
