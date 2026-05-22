# 🚀 Hướng Dẫn Test S.Budget Bằng Postman

Tài liệu này hướng dẫn chi tiết từng bước để bạn tự test các tính năng mới nhất của dự án (Đặc biệt là AI NLP và OCR), kèm theo các file JSON mẫu để copy-paste thẳng vào Postman.

---

## 🛠️ Bước 0: Chuẩn bị môi trường

1. Đảm bảo file `.env` trong thư mục `S.Budget` đã điền đủ Key thật:
   - `OPENAI_API_KEY=sk-...` (Bắt buộc cho Phase 2 & 3)
   - `CLOUDINARY_URL=cloudinary://...` (Bắt buộc cho Phase 3)
   - `JWT_SECRET=mot_chuoi_bi_mat_bat_ky`
2. Khởi động các Database & Message Queue bằng Terminal:
   ```bash
   cd S.Budget
   docker-compose up -d postgres rabbitmq
   ```
3. Mở 4 Terminal mới để chạy 4 service lõi:
   - Terminal 1: `npm run start:dev api-gateway`
   - Terminal 2: `npm run start:dev transaction-service`
   - Terminal 3: `npm run start:dev ai-service`
   - Terminal 4: `npm run start:dev auth-service`

---

## 🔐 Bước 1: Lấy JWT Token (Phase 1)
*Do API Gateway đã bật `JwtAuthGuard`, bạn bắt buộc phải có Token mới test được giao dịch.*

### 1.1. Đăng ký tài khoản (Register)
- **Method**: `POST`
- **URL**: `http://localhost:3000/api/v1/auth/register`
- **Body** (chọn `raw` -> `JSON`):
```json
{
  "email": "test@gmail.com",
  "password": "password123",
  "name": "Nguyen Van Test"
}
```

### 1.2. Đăng nhập (Login)
- **Method**: `POST`
- **URL**: `http://localhost:3000/api/v1/auth/login`
- **Body** (chọn `raw` -> `JSON`):
```json
{
  "email": "test@gmail.com",
  "password": "password123"
}
```
👉 **Kết quả**: Bạn sẽ nhận được `accessToken`. Hãy copy đoạn mã token này.

---

## 🤖 Bước 2: Test Phase 2 - Quick Add NLP (Xử lý ngôn ngữ tự nhiên)

Tính năng này sẽ gọi OpenAI để đọc hiểu câu nói của bạn và tự tạo giao dịch.

- **Method**: `POST`
- **URL**: `http://localhost:3000/api/v1/transactions/quick-add`
- **Headers**:
  - `Authorization`: `Bearer <paste_access_token_cua_ban_vao_day>`
- **Body** (chọn `raw` -> `JSON`):
```json
{
  "text": "Sáng nay đi ăn phở gõ hết 45k"
}
```
👉 **Kết quả mong đợi**: 
AI Service phân tích xong sẽ tạo ra JSON và lưu xuống Transaction DB:
```json
{
  "amount": 45000,
  "categoryName": "Ăn uống",
  "type": "expense",
  "note": "phở gõ"
}
```

---

## 📸 Bước 3: Test Phase 3 - Upload Hình Ảnh Hóa Đơn (OCR)

Tính năng này sẽ đẩy ảnh lên Cloudinary, sau đó gửi link ảnh sang GPT-4 Vision để quét hóa đơn.

- **Method**: `POST`
- **URL**: `http://localhost:3000/api/v1/transactions/upload-image`
- **Headers**:
  - `Authorization`: `Bearer <paste_access_token_cua_ban_vao_day>`
- **Body** (chọn `form-data`):
  - Chuyển cột `KEY` sang kiểu **File** (Bấm vào chữ Text nhỏ hiện ra mũi tên trỏ xuống -> chọn File).
  - Tên cột KEY ghi là: `file`
  - Cột VALUE: Bấm **Select Files** và chọn một tấm ảnh hóa đơn hoặc ảnh chụp màn hình chuyển khoản ngân hàng trên máy bạn.

👉 **Kết quả mong đợi**: 
Cloudinary sẽ trả về `imageUrl`, AI sẽ đọc được số tiền trên hóa đơn và trả về kết quả (tương tự JSON ở Bước 2) và đính kèm luôn `imageUrl` để bạn xem lại.

---

## 📊 Bước 4: Test Phase 4 - Thống kê & Phân tích bằng AI (Insight)

Tính năng này sẽ gọi Insight Service để lấy toàn bộ giao dịch, tính toán thống kê và nhờ AI phân tích thói quen, đưa ra lời khuyên.

### 4.1. Lấy thống kê chi tiêu
- **Method**: `GET`
- **URL**: `http://localhost:3000/api/v1/insights/stats?month=2026-05`
- **Headers**:
  - `Authorization`: `Bearer <paste_access_token_cua_ban_vao_day>`
- **Body**: `none`

👉 **Kết quả mong đợi**: Trả về tổng chi tiêu trong tháng chia theo từng danh mục.

### 4.2. Lấy phân tích hành vi chi tiêu (AI)
- **Method**: `GET`
- **URL**: `http://localhost:3000/api/v1/insights/behavior`
- **Headers**:
  - `Authorization`: `Bearer <paste_access_token_cua_ban_vao_day>`

👉 **Kết quả mong đợi**: AI sẽ nhận xét ngắn gọn về thói quen chi tiêu của bạn.

### 4.3. Xin lời khuyên tiết kiệm (AI)
- **Method**: `GET`
- **URL**: `http://localhost:3000/api/v1/insights/recommendations`
- **Headers**:
  - `Authorization`: `Bearer <paste_access_token_cua_ban_vao_day>`

👉 **Kết quả mong đợi**: AI đưa ra 3 lời khuyên thiết thực dựa trên chi tiêu thực tế của bạn.
