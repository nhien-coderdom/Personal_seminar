import { Test, TestingModule } from '@nestjs/testing';
import { InsightServiceController } from './insight-service.controller';
import { InsightServiceService } from './insight-service.service';

describe('InsightServiceController', () => {
  let controller: InsightServiceController;
  let service: InsightServiceService;

  beforeEach(async () => {
    const mockService = {
      getStats: jest.fn(),
      getRecommendations: jest.fn(),
      getBehavior: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [InsightServiceController],
      providers: [
        {
          provide: InsightServiceService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<InsightServiceController>(InsightServiceController);
    service = module.get<InsightServiceService>(InsightServiceService);
  });

  describe('getStats', () => {
    it('should call getStats on service', async () => {
      const mockResult = {
        month: '2026-05',
        totalExpense: 50000,
        breakdown: [],
      };
      (service.getStats as jest.Mock).mockResolvedValue(mockResult);

      const result = await controller.getStats({
        userId: 'user-1',
        month: '2026-05',
      });

      expect(service.getStats).toHaveBeenCalledWith({
        userId: 'user-1',
        month: '2026-05',
      });
      expect(result).toEqual(mockResult);
    });
  });

  describe('getRecommendations', () => {
    it('should call getRecommendations on service', async () => {
      const mockResult = { recommendation: 'Save more' };
      (service.getRecommendations as jest.Mock).mockResolvedValue(mockResult);

      const result = await controller.getRecommendations({
        userId: 'user-1',
      });

      expect(service.getRecommendations).toHaveBeenCalledWith({
        userId: 'user-1',
      });
      expect(result).toEqual(mockResult);
    });
  });
});
