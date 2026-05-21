# 🧪 Skill 05: Auto Test Case Generator

## Mục đích
Tự động sinh test cases (Unit + Integration) từ User Stories, API endpoints, hoặc source code hiện có.

## Hướng dẫn cho AI Agent

### Role
Bạn là **QA Engineer** cho dự án S.Budget (NestJS + Jest + Prisma + RabbitMQ).

### Quy trình

1. **Xác định scope test**:
   - Đọc prompt/yêu cầu → xác định module cần test
   - Đọc source code service tương ứng trong `S.Budget/apps/`
   - Xác định các input/output/edge cases

2. **Phân loại test**:

| Loại | Mục tiêu | Tool |
|------|----------|------|
| Unit Test | Service methods, utils | Jest + mock |
| Integration Test | API endpoints qua Gateway | Jest + supertest |
| E2E Test | Full flow cross-services | Jest + Docker |

3. **Sinh test cases** theo pattern NestJS:

#### Unit Test Template
```typescript
// {{service-name}}.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { {{ServiceName}}Service } from './{{service-name}}.service';

describe('{{ServiceName}}Service', () => {
  let service: {{ServiceName}}Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {{ServiceName}}Service,
        { provide: 'PRISMA_SERVICE', useValue: mockPrisma },
      ],
    }).compile();
    service = module.get<{{ServiceName}}Service>({{ServiceName}}Service);
  });

  describe('{{methodName}}', () => {
    it('should {{expected behavior}} when {{condition}}', async () => {
      // Arrange
      const input = { /* test data */ };
      // Act
      const result = await service.{{methodName}}(input);
      // Assert
      expect(result).toBeDefined();
      expect(result.{{field}}).toEqual({{expected}});
    });

    it('should throw error when {{error condition}}', async () => {
      await expect(service.{{methodName}}(invalidInput))
        .rejects.toThrow(RpcException);
    });
  });
});
```

#### Integration Test Template
```typescript
// {{controller}}.e2e-spec.ts
import * as request from 'supertest';

describe('{{ControllerName}} (e2e)', () => {
  let app;
  let jwtToken: string;

  beforeAll(async () => {
    // Setup app, get JWT token
  });

  describe('POST /api/v1/{{endpoint}}', () => {
    it('should return 201 with valid data', () => {
      return request(app.getHttpServer())
        .post('/api/v1/{{endpoint}}')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({ /* valid data */ })
        .expect(201)
        .expect((res) => {
          expect(res.body.id).toBeDefined();
        });
    });

    it('should return 401 without token', () => {
      return request(app.getHttpServer())
        .post('/api/v1/{{endpoint}}')
        .send({ /* data */ })
        .expect(401);
    });
  });
});
```

4. **Tạo test matrix** cho mỗi User Story:

```markdown
## Test Matrix — US-{{XX}}

| # | Test Case | Type | Input | Expected | Priority |
|---|-----------|------|-------|----------|----------|
| TC-01 | Happy path | Unit | Valid data | Success | P0 |
| TC-02 | Missing required field | Unit | Null field | Validation error | P0 |
| TC-03 | Unauthorized access | Integration | No JWT | 401 | P0 |
| TC-04 | Edge case — empty | Unit | Empty string | Handle gracefully | P1 |
| TC-05 | Concurrent requests | Integration | 100 parallel | No data race | P2 |
```

5. **Lưu file** test vào đúng vị trí trong monorepo:
   - `S.Budget/apps/{{service}}/src/{{module}}/{{file}}.spec.ts`

### Kích hoạt
```
Đọc file skills/05_test_case_generator.md và tạo test cases cho module {{MODULE_NAME}}.
User Stories liên quan: {{US-XX}}
```
