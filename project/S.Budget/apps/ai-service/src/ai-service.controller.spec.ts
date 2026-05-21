import { Test, TestingModule } from '@nestjs/testing';
import { AiServiceController } from './ai-service.controller';
import { AiServiceService } from './ai-service.service';

describe('AiServiceController', () => {
  let controller: AiServiceController;
  let service: AiServiceService;

  beforeEach(async () => {
    const mockService = {
      parseTextToTransaction: jest.fn(),
      processImageOcr: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AiServiceController],
      providers: [
        {
          provide: AiServiceService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<AiServiceController>(AiServiceController);
    service = module.get<AiServiceService>(AiServiceService);
  });

  describe('processImageOcr', () => {
    it('should call processImageOcr on service', async () => {
      const mockResult = { amount: 100000, category: 'food' };
      (service.processImageOcr as jest.Mock).mockResolvedValue(mockResult);

      const result = await controller.processImageOcr({
        imageUrl: 'http://example.com/receipt.jpg',
      });

      expect(service.processImageOcr).toHaveBeenCalledWith(
        'http://example.com/receipt.jpg',
      );
      expect(result).toEqual(mockResult);
    });
  });

  describe('parseText', () => {
    it('should call parseTextToTransaction on service', async () => {
      const mockResult = { category: 'transport', confidence: 0.9 };
      (service.parseTextToTransaction as jest.Mock).mockResolvedValue(
        mockResult,
      );

      const result = await controller.parseText({
        text: 'taxi fare',
      });

      expect(service.parseTextToTransaction).toHaveBeenCalledWith('taxi fare');
      expect(result).toEqual(mockResult);
    });
  });
});
