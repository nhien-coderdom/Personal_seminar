import { Test, TestingModule } from '@nestjs/testing';
import { TransactionServiceController } from './transaction-service.controller';
import { TransactionServiceService } from './transaction-service.service';

describe('TransactionServiceController', () => {
  let controller: TransactionServiceController;
  let service: TransactionServiceService;

  beforeEach(async () => {
    const mockService = {
      create: jest.fn(),
      quickAdd: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionServiceController],
      providers: [
        {
          provide: TransactionServiceService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<TransactionServiceController>(
      TransactionServiceController,
    );
    service = module.get<TransactionServiceService>(TransactionServiceService);
  });

  describe('quickAdd', () => {
    it('should call quickAdd on service with correct params', async () => {
      const mockResult = {
        id: '1',
        amount: 80000,
        note: '80k cafe',
        categoryId: 'cat1',
        type: 'expense',
      };
      (service.quickAdd as jest.Mock).mockResolvedValue(mockResult);

      const result = await controller.quickAdd({
        userId: 'user-1',
        dto: { text: '80k cafe' },
      });

      expect(service.quickAdd).toHaveBeenCalledWith('user-1', {
        text: '80k cafe',
      });
      expect(result).toEqual(mockResult);
    });
  });

  describe('create', () => {
    it('should call create on service', async () => {
      const mockResult = { id: '2', amount: 50000, note: 'Lunch' };
      (service.create as jest.Mock).mockResolvedValue(mockResult);

      const dto = {
        amount: 50000,
        note: 'Lunch',
        type: 'expense',
        date: new Date().toISOString(),
      } as any;
      const result = await controller.create({
        userId: 'user-1',
        dto,
      });

      expect(service.create).toHaveBeenCalledWith('user-1', dto);
      expect(result).toEqual(mockResult);
    });
  });

  describe('findAll', () => {
    it('should return transactions list', async () => {
      const mockResult = { data: [], total: 0 };
      (service.findAll as jest.Mock).mockResolvedValue(mockResult);

      const result = await controller.findAll({ userId: 'user-1', query: {} });

      expect(service.findAll).toHaveBeenCalledWith('user-1', {});
      expect(result).toEqual(mockResult);
    });
  });
});
