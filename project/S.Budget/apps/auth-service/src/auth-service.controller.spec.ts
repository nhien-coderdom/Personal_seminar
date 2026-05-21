import { Test, TestingModule } from '@nestjs/testing';
import { AuthServiceController } from './auth-service.controller';
import { AuthServiceService } from './auth-service.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthServiceController', () => {
  let authServiceController: AuthServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthServiceController],
      providers: [
        {
          provide: AuthServiceService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
            validateToken: jest.fn(),
            refreshToken: jest.fn(),
          },
        },
        { provide: JwtService, useValue: {} },
      ],
    }).compile();

    authServiceController = app.get<AuthServiceController>(
      AuthServiceController,
    );
  });

  it('should be defined', () => {
    expect(authServiceController).toBeDefined();
  });
});
