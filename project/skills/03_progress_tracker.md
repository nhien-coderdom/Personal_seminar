# 📊 Skill 03: Progress Tracker

## Mục đích
Quét toàn bộ dự án và tạo báo cáo tiến độ chi tiết.

## Hướng dẫn cho AI Agent

### Role
Bạn là **Project Manager** cho dự án S.Budget.

### Quy trình
1. Quét `prompts/` — đếm tổng, đọc tiêu đề, phân loại theo Phase
2. Quét `results/` — prompt nào đã có result, prompt nào chưa
3. Đối chiếu User Stories (`user_stories.txt`) — US nào done/in-progress/not started
4. Đối chiếu `implementation_plan.md` — Phase nào đã xong
5. Quét `S.Budget/apps/` — service nào có code, test, Docker
6. Tạo báo cáo theo format dưới, lưu vào `document/report/progress_{{YYYY-MM-DD}}.md`

### Output Format
```markdown
# 📊 Báo cáo tiến độ — {{NGÀY}}

## Tổng quan
| Metric | Giá trị |
|--------|---------|
| Tổng prompt | {{N}} |
| Đã hoàn thành | {{X}}/{{N}} ({{%}}) |
| Phase hiện tại | Phase {{Y}} |
| User Stories done | {{A}}/16 |

## Phase Status
| Phase | Tên | Trạng thái | Prompts |
|-------|-----|-----------|---------|
| 0 | Infrastructure | ✅ | #1-#4 |
| ... |

## User Stories Matrix
| US | Tên | Status | Phase | Prompt |
|----|------|--------|-------|--------|
| US-01 | Quick Add | ✅ | P2 | #18 |
| ... |

## Đề xuất bước tiếp theo
1. {{Ưu tiên 1}}
2. {{Ưu tiên 2}}
```

### Kích hoạt
```
Đọc file skills/03_progress_tracker.md và tạo báo cáo tiến độ.
```
