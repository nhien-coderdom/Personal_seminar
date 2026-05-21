import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import {
  CreateTransactionDto,
  UpdateTransactionDto,
  QuickAddDto,
} from '@app/shared/dto';
import { ITransaction, ICategory } from '@app/shared/interfaces';
import { DEFAULT_CATEGORIES } from '@app/shared/constants';

@Injectable()
export class TransactionServiceService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── SEED DEFAULT CATEGORIES (gọi khi Transaction Service khởi động) ─────────

  async seedDefaultCategories(): Promise<void> {
    for (const cat of DEFAULT_CATEGORIES) {
      // Dùng findFirst+create thay vì upsert vì name không có unique constraint trong schema
      const existing = await this.prisma.category.findFirst({
        where: { name: cat.name },
      });
      if (!existing) {
        await this.prisma.category.create({
          data: { name: cat.name, icon: cat.icon, color: cat.color },
        });
      }
    }
  }

  // ─── CREATE TRANSACTION ───────────────────────────────────────────────────────

  /**
   * Tạo giao dịch thông thường.
   * Nếu không có categoryId → tự động tạo category mới trong cùng 1 Prisma Transaction
   * để đảm bảo tính toàn vẹn dữ liệu.
   */
  async create(
    userId: string,
    dto: CreateTransactionDto,
  ): Promise<ITransaction> {
    return this.prisma.$transaction(async (tx) => {
      let categoryId = dto.categoryId ?? null;

      // Nếu client truyền tên category mới thay vì ID → tạo category trong cùng tx
      if (!categoryId && (dto as any).categoryName) {
        const newCat = await tx.category.create({
          data: { name: (dto as any).categoryName },
        });
        categoryId = newCat.id;
      }

      const transaction = await tx.transaction.create({
        data: {
          userId,
          amount: BigInt(dto.amount),
          type: dto.type ?? 'expense',
          categoryId,
          note: dto.note,
          imageUrl: dto.imageUrl,
          source: dto.source ?? 'manual',
          date: dto.date ? new Date(dto.date) : undefined,
        },
        include: { category: true },
      });

      return this._mapTransaction(transaction);
    });
  }

  // ─── QUICK ADD ────────────────────────────────────────────────────────────────

  /**
   * Nhập nhanh giao dịch từ text tự nhiên (đã được AI parse sẵn).
   */
  async quickAdd(userId: string, dto: QuickAddDto): Promise<ITransaction> {
    return this.prisma.$transaction(async (tx) => {
      // Tìm category theo tên, tạo mới nếu chưa có
      let category = dto.categoryName
        ? await tx.category.findFirst({ where: { name: dto.categoryName } })
        : null;

      if (!category && dto.categoryName) {
        category = await tx.category.create({
          data: { name: dto.categoryName },
        });
      }

      const transaction = await tx.transaction.create({
        data: {
          userId,
          amount: BigInt(dto.amount),
          type: dto.type ?? 'expense',
          categoryId: category?.id ?? null,
          note: dto.note,
          source: 'quick_add',
          date: (dto as any).date ? new Date((dto as any).date) : undefined,
        },
        include: { category: true },
      });

      return this._mapTransaction(transaction);
    });
  }

  // ─── FIND ALL ─────────────────────────────────────────────────────────────────

  async findAll(
    userId: string,
    query: {
      page?: number;
      limit?: number;
      type?: 'expense' | 'income';
      categoryId?: string;
      startDate?: string;
      endDate?: string;
    } = {},
  ): Promise<{
    data: ITransaction[];
    total: number;
    page: number;
    limit: number;
  }> {
    const {
      page = 1,
      limit = 20,
      type,
      categoryId,
      startDate,
      endDate,
    } = query;
    const skip = (page - 1) * limit;

    const where = {
      userId,
      isDeleted: false,
      ...(type && { type }),
      ...(categoryId && { categoryId }),
      ...(startDate || endDate
        ? {
            date: {
              ...(startDate && { gte: new Date(startDate) }),
              ...(endDate && { lte: new Date(endDate) }),
            },
          }
        : {}),
    };

    const [transactions, total] = await this.prisma.$transaction([
      this.prisma.transaction.findMany({
        where,
        skip,
        take: limit,
        orderBy: { date: 'desc' },
        include: { category: true },
      }),
      this.prisma.transaction.count({ where }),
    ]);

    return {
      data: transactions.map((t) => this._mapTransaction(t)),
      total,
      page,
      limit,
    };
  }

  // ─── FIND ONE ─────────────────────────────────────────────────────────────────

  async findOne(userId: string, id: string): Promise<ITransaction> {
    const transaction = await this.prisma.transaction.findFirst({
      where: { id, userId, isDeleted: false },
      include: { category: true },
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction ${id} not found`);
    }

    return this._mapTransaction(transaction);
  }

  // ─── UPDATE ───────────────────────────────────────────────────────────────────

  async update(
    userId: string,
    id: string,
    dto: UpdateTransactionDto,
  ): Promise<ITransaction> {
    // Kiểm tra tồn tại trước
    await this.findOne(userId, id);

    const transaction = await this.prisma.transaction.update({
      where: { id },
      data: {
        ...(dto.amount !== undefined && { amount: BigInt(dto.amount) }),
        ...(dto.type && { type: dto.type }),
        ...(dto.categoryId !== undefined && { categoryId: dto.categoryId }),
        ...(dto.note !== undefined && { note: dto.note }),
        ...(dto.date !== undefined && {
          date: dto.date ? new Date(dto.date) : undefined,
        }),
      },
      include: { category: true },
    });

    return this._mapTransaction(transaction);
  }

  // ─── SOFT DELETE ──────────────────────────────────────────────────────────────

  async remove(userId: string, id: string): Promise<{ success: boolean }> {
    // Kiểm tra tồn tại trước
    await this.findOne(userId, id);

    await this.prisma.transaction.update({
      where: { id },
      data: { isDeleted: true },
    });

    return { success: true };
  }

  // ─── GET ALL CATEGORIES ───────────────────────────────────────────────────────

  async getCategories(): Promise<ICategory[]> {
    const categories = await this.prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
    return categories.map((c) => ({
      id: c.id,
      name: c.name,
      icon: c.icon,
      color: c.color,
      createdAt: c.createdAt,
    }));
  }

  // ─── MAPPER ───────────────────────────────────────────────────────────────────

  private _mapTransaction(t: any): ITransaction {
    return {
      id: t.id,
      userId: t.userId,
      amount: Number(t.amount), // BigInt → number
      type: t.type as 'expense' | 'income',
      categoryId: t.categoryId,
      category: t.category
        ? {
            id: t.category.id,
            name: t.category.name,
            icon: t.category.icon,
            color: t.category.color,
            createdAt: t.category.createdAt,
          }
        : undefined,
      note: t.note,
      imageUrl: t.imageUrl,
      source: t.source as ITransaction['source'],
      isDeleted: t.isDeleted,
      date: t.date,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
    };
  }
}
