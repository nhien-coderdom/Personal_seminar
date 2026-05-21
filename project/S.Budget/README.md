# S.Budget — Smart Budget Management

> Ứng dụng quản lý chi tiêu cá nhân thông minh với AI — tự động nhận diện giao dịch từ ảnh, phân loại chi tiêu, và gợi ý tiết kiệm.

## 🏗 Architecture

```
Client (React Native) → API Gateway → Microservices (RabbitMQ)
                                        ├── Auth Service      (auth_db)
                                        ├── Transaction Service (transaction_db)
                                        ├── AI Service          (Google Cloud Vision + OpenAI)
                                        └── Insight Service     (insight_db)
```

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | NestJS + TypeScript (Monorepo) |
| Transport | RabbitMQ (Microservice messaging) |
| Database | PostgreSQL + Prisma ORM |
| AI / OCR | Google Cloud Vision |
| AI / Insight | OpenAI API |
| Image Storage | Cloudinary |
| Container | Docker + Docker Compose |
| CI/CD | GitHub Actions |
| Deploy | GCP (Google Cloud Platform) |
| Frontend | React Native |

## 📁 Project Structure

```
S.Budget/
├── apps/
│   ├── api-gateway/        # HTTP → RabbitMQ proxy
│   ├── auth-service/       # Authentication & JWT
│   ├── transaction-service/ # CRUD + Quick Add
│   ├── ai-service/         # OCR + Classification
│   └── insight-service/    # Stats + AI Insights
├── libs/
│   └── shared/             # DTOs, constants, interfaces
├── scripts/                # DB init scripts
├── docker-compose.yml
└── .github/workflows/      # CI/CD
```

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- npm

### 1. Clone & Install
```bash
git clone <repo-url>
cd S.Budget
npm install
```

### 2. Setup Environment
```bash
cp .env.example .env
# Edit .env with your API keys
```

### 3. Start Infrastructure (PostgreSQL + RabbitMQ)
```bash
docker-compose up -d postgres rabbitmq
```

### 4. Run Prisma Migrations
```bash
# Auth DB
npx prisma migrate dev --schema=apps/auth-service/prisma/schema.prisma

# Transaction DB
npx prisma migrate dev --schema=apps/transaction-service/prisma/schema.prisma

# Insight DB
npx prisma migrate dev --schema=apps/insight-service/prisma/schema.prisma
```

### 5. Start Services (Development)
```bash
# Terminal 1: API Gateway
npx nest start api-gateway --watch

# Terminal 2: Auth Service
npx nest start auth-service --watch

# Terminal 3: Transaction Service
npx nest start transaction-service --watch

# Terminal 4: AI Service
npx nest start ai-service --watch

# Terminal 5: Insight Service
npx nest start insight-service --watch
```

### 6. Start All with Docker
```bash
docker-compose up --build
```

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register new user |
| POST | `/api/v1/auth/login` | Login |
| POST | `/api/v1/auth/refresh` | Refresh JWT token |
| POST | `/api/v1/transactions` | Create transaction |
| POST | `/api/v1/transactions/quick-add` | Quick add "80k cafe" |
| GET | `/api/v1/transactions` | List transactions |
| GET | `/api/v1/transactions/:id` | Get transaction by ID |
| PUT | `/api/v1/transactions/:id` | Update transaction |
| DELETE | `/api/v1/transactions/:id` | Soft delete transaction |
| GET | `/api/v1/insights/stats` | Spending statistics |
| GET | `/api/v1/insights/behavior` | Behavior analysis |
| GET | `/api/v1/insights/recommendations` | AI recommendations |

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:cov
```

## 📝 License

UNLICENSED — Private project
