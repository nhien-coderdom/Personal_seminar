# 🚀 Skill 08: CI/CD Pipeline Automation

## Mục đích
Tự động tạo, cấu hình, và quản lý pipeline CI/CD cho dự án S.Budget sử dụng GitHub Actions + Docker.

## Hướng dẫn cho AI Agent

### Role
Bạn là **DevOps Engineer** thiết lập CI/CD pipeline production-grade.

### Pipeline Architecture
```
Push to GitHub
    │
    ▼
┌──────────────────────────────────────────┐
│           GitHub Actions CI              │
│                                          │
│  ┌─────────┐  ┌──────┐  ┌────────────┐ │
│  │  Lint    │→ │ Test │→ │   Build    │ │
│  │ eslint   │  │ jest │  │  docker    │ │
│  └─────────┘  └──────┘  └────────────┘ │
│                              │           │
│                              ▼           │
│                    ┌─────────────────┐   │
│                    │  Push to        │   │
│                    │  Docker Hub     │   │
│                    └─────────────────┘   │
│                              │           │
│                              ▼           │
│                    ┌─────────────────┐   │
│                    │  Deploy (SSH)   │   │
│                    │  docker-compose │   │
│                    │  up -d          │   │
│                    └─────────────────┘   │
└──────────────────────────────────────────┘
```

### Workflow Files cần tạo

#### 1. CI Workflow — `ci.yml`
```yaml
# .github/workflows/ci.yml
name: S.Budget CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint

  test:
    needs: lint
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: test
          POSTGRES_DB: test_db
        ports: ['5432:5432']
      rabbitmq:
        image: rabbitmq:3-management
        ports: ['5672:5672']
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run test -- --coverage
      - uses: actions/upload-artifact@v4
        with:
          name: coverage-report
          path: coverage/

  build:
    needs: test
    runs-on: ubuntu-latest
    strategy:
      matrix:
        service: [api-gateway, auth-service, transaction-service, ai-service, insight-service]
    steps:
      - uses: actions/checkout@v4
      - run: docker build -f apps/${{ matrix.service }}/Dockerfile -t sbudget/${{ matrix.service }}:${{ github.sha }} .
```

#### 2. CD Workflow — `cd.yml`
```yaml
# .github/workflows/cd.yml
name: S.Budget CD

on:
  push:
    branches: [main]
    tags: ['v*']

jobs:
  deploy:
    runs-on: ubuntu-latest
    needs: [build]
    steps:
      - uses: actions/checkout@v4
      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_TOKEN }}
      - name: Build & Push All Services
        run: |
          for service in api-gateway auth-service transaction-service ai-service insight-service; do
            docker build -f apps/$service/Dockerfile -t ${{ secrets.DOCKER_USERNAME }}/sbudget-$service:latest .
            docker push ${{ secrets.DOCKER_USERNAME }}/sbudget-$service:latest
          done
      - name: Deploy to Server
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SERVER_SSH_KEY }}
          script: |
            cd /opt/sbudget
            docker-compose pull
            docker-compose up -d
            docker image prune -f
```

### Quy trình kích hoạt

1. **Tạo workflows**: Tạo files YAML trong `.github/workflows/`
2. **Cấu hình secrets**: Hướng dẫn set GitHub Secrets
3. **Test pipeline**: Push commit test để verify
4. **Monitor**: Kiểm tra Actions tab trên GitHub

### GitHub Secrets cần thiết
| Secret | Mô tả |
|--------|-------|
| `DOCKER_USERNAME` | Docker Hub username |
| `DOCKER_TOKEN` | Docker Hub access token |
| `SERVER_HOST` | IP/domain server deploy |
| `SERVER_USER` | SSH username |
| `SERVER_SSH_KEY` | SSH private key |
| `OPENAI_API_KEY` | OpenAI key cho AI service |
| `CLOUDINARY_URL` | Cloudinary connection string |

### Kích hoạt
```
Đọc file skills/08_cicd_pipeline.md và tạo/cập nhật CI/CD pipeline cho dự án S.Budget.
```
