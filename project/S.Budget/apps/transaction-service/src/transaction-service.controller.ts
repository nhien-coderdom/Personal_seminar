import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TransactionServiceService } from './transaction-service.service';
import { MESSAGE_PATTERNS } from '@app/shared/constants';
import {
  CreateTransactionDto,
  UpdateTransactionDto,
  QuickAddDto,
} from '@app/shared/dto';

@Controller()
export class TransactionServiceController {
  constructor(
    private readonly transactionServiceService: TransactionServiceService,
  ) {}

  /** Tạo giao dịch mới (có thể tạo category mới trong cùng Prisma Transaction) */
  @MessagePattern(MESSAGE_PATTERNS.TRANSACTION_CREATE)
  create(@Payload() data: { userId: string; dto: CreateTransactionDto }) {
    return this.transactionServiceService.create(data.userId, data.dto);
  }

  /** Nhập nhanh từ text tự nhiên (AI đã parse) */
  @MessagePattern(MESSAGE_PATTERNS.TRANSACTION_QUICK_ADD)
  quickAdd(@Payload() data: { userId: string; dto: QuickAddDto }) {
    return this.transactionServiceService.quickAdd(data.userId, data.dto);
  }

  /** Lấy danh sách giao dịch (phân trang, lọc) */
  @MessagePattern(MESSAGE_PATTERNS.TRANSACTION_FIND_ALL)
  findAll(
    @Payload()
    data: {
      userId: string;
      query?: {
        page?: number;
        limit?: number;
        type?: 'expense' | 'income';
        categoryId?: string;
        startDate?: string;
        endDate?: string;
      };
    },
  ) {
    return this.transactionServiceService.findAll(data.userId, data.query);
  }

  /** Lấy chi tiết một giao dịch */
  @MessagePattern(MESSAGE_PATTERNS.TRANSACTION_FIND_ONE)
  findOne(@Payload() data: { userId: string; id: string }) {
    return this.transactionServiceService.findOne(data.userId, data.id);
  }

  /** Cập nhật giao dịch */
  @MessagePattern(MESSAGE_PATTERNS.TRANSACTION_UPDATE)
  update(
    @Payload() data: { userId: string; id: string; dto: UpdateTransactionDto },
  ) {
    return this.transactionServiceService.update(
      data.userId,
      data.id,
      data.dto,
    );
  }

  /** Xoá mềm giao dịch (soft-delete) */
  @MessagePattern(MESSAGE_PATTERNS.TRANSACTION_DELETE)
  remove(@Payload() data: { userId: string; id: string }) {
    return this.transactionServiceService.remove(data.userId, data.id);
  }

  /** Lấy tất cả danh mục (public — không cần userId) */
  @MessagePattern(MESSAGE_PATTERNS.CATEGORY_FIND_ALL)
  getCategories() {
    return this.transactionServiceService.getCategories();
  }
}
