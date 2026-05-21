import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import OpenAI from 'openai';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from './prisma.service';
import {
  TRANSACTION_SERVICE,
  MESSAGE_PATTERNS,
} from '@app/shared/constants/index';

@Injectable()
export class InsightServiceService {
  private openai: OpenAI;
  private readonly logger = new Logger(InsightServiceService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(TRANSACTION_SERVICE)
    private readonly transactionClient: ClientProxy,
  ) {
    this.openai = new OpenAI({
      apiKey: process.env['OPENAI_API_KEY'],
    });
  }

  // Lấy thống kê và cập nhật SpendingSnapshot
  async getStats(data: { userId: string; month: string }) {
    const { userId, month } = data;

    // 1. Fetch transactions từ transaction-service cho tháng được chỉ định
    const startDate = `${month}-01T00:00:00.000Z`;
    // Tính endDate: ngày 1 của tháng tiếp theo
    const [y, m] = month.split('-');
    let nextY = parseInt(y);
    let nextM = parseInt(m) + 1;
    if (nextM > 12) {
      nextM = 1;
      nextY++;
    }
    const nextMonthStr = `${nextY}-${nextM.toString().padStart(2, '0')}`;
    const endDate = `${nextMonthStr}-01T00:00:00.000Z`;

    try {
      const response = await firstValueFrom(
        this.transactionClient.send(MESSAGE_PATTERNS.TRANSACTION_FIND_ALL, {
          userId,
          query: { limit: 1000, startDate, endDate, type: 'expense' },
        }),
      );

      const transactions = response.data || [];

      // 2. Tính toán thống kê theo Category
      const statsMap = new Map<string, { total: bigint; count: number }>();
      let totalAmount = 0n;

      for (const t of transactions) {
        const catName = t.category?.name || 'Chưa phân loại';
        const amount = BigInt(t.amount);
        totalAmount += amount;

        const current = statsMap.get(catName) || { total: 0n, count: 0 };
        statsMap.set(catName, {
          total: current.total + amount,
          count: current.count + 1,
        });
      }

      // 3. Cập nhật vào Insight Database (spending_snapshots)
      const results = [];
      for (const [category, data] of statsMap.entries()) {
        const snapshot = await this.prisma.spendingSnapshot.create({
          data: {
            userId,
            period: month,
            category,
            total: data.total,
            count: data.count,
          },
        });
        results.push({
          category: snapshot.category,
          total: Number(snapshot.total),
          count: snapshot.count,
        });
      }

      return {
        month,
        totalExpense: Number(totalAmount),
        breakdown: results,
      };
    } catch (error) {
      this.logger.error('Failed to get stats', error);
      throw error;
    }
  }

  // Lấy nhận xét từ AI
  async getRecommendations(data: { userId: string }) {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const stats = await this.getStats({
      userId: data.userId,
      month: currentMonth,
    });

    if (stats.breakdown.length === 0) {
      return {
        message: 'Bạn chưa có chi tiêu nào trong tháng này để AI phân tích.',
      };
    }

    const promptText = `
Bạn là một chuyên gia tư vấn tài chính cá nhân. Dưới đây là thống kê chi tiêu tháng ${currentMonth} của người dùng:
Tổng chi tiêu: ${stats.totalExpense} VND.
Chi tiết theo từng danh mục:
${stats.breakdown.map((b) => `- ${b.category}: ${b.total} VND (${b.count} giao dịch)`).join('\n')}

Hãy đưa ra 3 lời khuyên ngắn gọn, thân thiện và thiết thực nhất để giúp người dùng tối ưu hóa chi tiêu và tiết kiệm tiền. Trả về dưới dạng một chuỗi văn bản duy nhất (dùng gạch đầu dòng).
`;

    try {
      const completion = await this.openai.chat.completions.create({
        messages: [{ role: 'user', content: promptText }],
        model: 'gpt-4o',
      });

      const recommendation =
        completion.choices[0].message.content || 'Không có gợi ý.';

      // Lưu lại insight
      await this.prisma.aiInsight.create({
        data: {
          userId: data.userId,
          type: 'recommendation',
          content: recommendation,
          period: currentMonth,
        },
      });

      return { recommendation };
    } catch (error) {
      this.logger.error('AI Error', error);
      throw new Error('Could not generate recommendations');
    }
  }

  async getBehavior(data: { userId: string }) {
    // Tương tự getRecommendations nhưng tập trung vào phân tích hành vi
    const currentMonth = new Date().toISOString().slice(0, 7);
    const stats = await this.getStats({
      userId: data.userId,
      month: currentMonth,
    });

    if (stats.breakdown.length === 0) {
      return { message: 'Không đủ dữ liệu để phân tích.' };
    }

    const promptText = `
Dưới đây là thống kê chi tiêu tháng ${currentMonth} của người dùng:
Tổng chi tiêu: ${stats.totalExpense} VND.
Chi tiết:
${stats.breakdown.map((b) => `- ${b.category}: ${b.total} VND (${b.count} giao dịch)`).join('\n')}

Hãy phân tích ngắn gọn thói quen chi tiêu của người dùng này trong 1 đoạn văn (tối đa 4 câu). Người dùng đang tập trung chi tiền vào đâu nhiều nhất? Có hợp lý không?
`;

    try {
      const completion = await this.openai.chat.completions.create({
        messages: [{ role: 'user', content: promptText }],
        model: 'gpt-4o',
      });

      const behavior =
        completion.choices[0].message.content || 'Không có phân tích.';

      await this.prisma.aiInsight.create({
        data: {
          userId: data.userId,
          type: 'behavior',
          content: behavior,
          period: currentMonth,
        },
      });

      return { behavior };
    } catch (error) {
      this.logger.error('AI Error', error);
      throw new Error('Could not generate behavior analysis');
    }
  }
}
