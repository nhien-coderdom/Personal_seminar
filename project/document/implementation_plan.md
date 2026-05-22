# S.Budget — Implementation Plan (Master Architecture)

## Goal
Xây dựng một kế hoạch tổng thể mới (tách biệt rõ ràng Backend và Frontend) dựa trên danh sách User Stories cập nhật (thêm US-07, US-17) và Tech Stack chi tiết (Mobile App React Native + Expo).

## Quyết định Thiết kế (Đã chốt)
> [!NOTE]
> 1. **Chiến lược Offline & Sync:** Sử dụng **Cache-first với TanStack Query** (Không làm full offline-first bằng SQLite).
> 2. **Bảo mật dữ liệu:** Sử dụng TDE (Transparent Data Encryption) / Encryption-at-rest cho Database. Không mã hóa cấp độ field để tránh phức tạp performance.
> 3. **Share Screenshot (US-03):** Không ưu tiên trong Phase đầu. (Feature backlog bổ sung sau).

---

## 1. Backend Implementation Plan

### Tech Stack
- **Core:** NestJS, TypeScript
- **Gateway & Microservices:** NestJS Gateway, RabbitMQ
- **Database:** PostgreSQL (Database per service: `auth_db`, `transaction_db`, `insight_db`), Prisma ORM
- **AI & Media:** OpenAI API, Cloudinary
- **Testing & DevOps:** Jest, Supertest, Docker, GitHub Actions

### Kế hoạch Triển khai (BE Phases)

#### Phase 0: Infrastructure Setup
- **Mục tiêu:** Thiết lập nền tảng dự án ban đầu.
- **Chi tiết:** NestJS monorepo workspace, API Gateway, Docker, PostgreSQL (3 DBs), Prisma, RabbitMQ, Cloudinary, CI/CD.

#### Phase 1: Auth Service
- **Mục tiêu:** Xác thực người dùng (US-15, US-16).
- **Chi tiết:** Register/Login, JWT, Refresh Token.

#### Phase 2: Transaction Service
- **Mục tiêu:** Quản lý giao dịch cốt lõi (US-01, US-09, US-10, US-11).
- **Chi tiết:** Quick Add text parser, CRUD giao dịch cơ bản.

#### Phase 3: AI Service
- **Mục tiêu:** Phân tích dữ liệu tự động (US-02, US-04, US-05, US-06, US-08).
- **Chi tiết:** Tích hợp OpenAI, OCR, detect Amount, Auto Classification qua RabbitMQ async flow.

#### Phase 4: Insight Service
- **Mục tiêu:** Phân tích tài chính (US-12, US-13, US-14).
- **Chi tiết:** Thống kê, Behavior Analysis, AI Recommendations.

#### Phase 5: Polish & Deploy
- **Mục tiêu:** Đóng gói và phát hành.
- **Chi tiết:** Unit testing, E2E testing, security, docs, deployment.

#### Phase 6: Nâng cấp AI & Xử lý Correction (US-07)
- **Mục tiêu:** Cải thiện độ chính xác AI khi user sửa dữ liệu.
- **Chi tiết:**
  - Cập nhật Prisma Schema của `transaction_db`: Thêm bảng `TransactionCorrection` để lưu trữ log chỉnh sửa từ phía user (giá trị cũ do AI đoán vs giá trị mới).
  - Viết worker xử lý async (RabbitMQ) để gửi các correction này về `ai-service` nhằm cập nhật prompt/context cho các lần phân tích sau.

#### Phase 7: Đồng bộ & Backup (US-15, US-17)
- **Mục tiêu:** Quản lý tài khoản, đồng bộ đa thiết bị, sao lưu dữ liệu.
- **Chi tiết:**
  - Phát triển API Sync trong `transaction-service`: Endpoint trả về các giao dịch bị thay đổi dựa trên `lastModifiedAt` để FE đồng bộ.
  - Thêm API Export/Import data (JSON/CSV) để hỗ trợ "Sao lưu & khôi phục" thủ công, kết hợp với Auto-backup trên cloud database.

---

## 2. Frontend Implementation Plan (Mobile App)

### Tech Stack
- **Framework:** React Native + Expo
- **Language:** TypeScript
- **Routing:** Expo Router
- **State & Data Fetching:** Zustand (Local/UI State), TanStack Query (Server State), Axios
- **Form & Validation:** React Hook Form + Zod
- **UI & Styling:** NativeWind, react-native-gifted-charts, DayJS
- **Native APIs:** Expo SecureStore (Token), Expo Image Picker
- **Testing:** Jest, React Native Testing Library, Maestro (E2E)

### Cấu trúc Component & Routing (FE Phases)

#### Phase 1: Foundation & Auth (US-15, US-16)
- **Setup Project:** Khởi tạo Expo app với TypeScript và NativeWind.
- **Routing:** 
  - `(auth)/login`, `(auth)/register`.
  - Thiết lập Expo SecureStore để lưu JWT token an toàn.
  - Tích hợp màn hình Khóa App (PIN/Biometrics - US-16).

#### Phase 2: Core Transaction & Dashboard (US-01, 09, 10, 11)
- **Routing:**
  - `(tabs)/dashboard`: Hiển thị danh sách giao dịch, số dư, dùng TanStack Query để cache data.
  - `(modals)/quick-add`: Form nhập text nhanh (`react-hook-form` + `zod`), gọi API Quick Add.
  - `(modals)/transaction-detail`: Xem, sửa, xóa giao dịch.

#### Phase 3: Smart Capture (US-02, 04, 05, 06, 08)
- **Tính năng:**
  - Tích hợp `expo-image-picker` để chụp ảnh (US-04) và upload (US-02).
  - Màn hình **Smart Review**: Hiển thị kết quả OCR từ AI (US-05, 06), cho phép user chỉnh sửa trước khi lưu (việc chỉnh sửa sẽ trigger US-07 ở BE).
  - Hiển thị pop-up/card gợi ý giao dịch khi mở app (US-08) nếu có ảnh mới.
  - *(Tính năng Share Screenshot US-03 sẽ làm ở Backlog sau).*

#### Phase 4: Insight & Analytics (US-12, 13, 14)
- **Routing:** `(tabs)/insights`.
- **Tính năng:**
  - Sử dụng `react-native-gifted-charts` để vẽ biểu đồ chi tiêu (US-12).
  - Hiển thị các Insight Cards (US-13, 14) lấy từ `insight-service`.

#### Phase 5: FE Testing & E2E
- Viết Unit/Component tests bằng Jest + RNTL.
- Viết flow E2E bằng Maestro để test toàn bộ luồng "Chụp ảnh -> Nhận diện -> Lưu giao dịch".

---

## Verification Plan

### Backend Verification
- Unit/Integration Tests pass.
- Thử nghiệm các endpoint mới (Sync, Backup) thông qua Postman/Swagger.

### Frontend Verification
- Chạy thử nghiệm qua Expo Go / Simulator (iOS/Android).
- Maestro E2E Scripts pass các luồng chính.
