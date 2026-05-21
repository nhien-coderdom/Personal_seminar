import { PrismaClient } from '../node_modules/.prisma/insight-client';
import { SEED_USERS } from './constants';

const prisma = new PrismaClient();

export async function seedInsight() {
  console.log('--- Seeding Insight DB ---');

  const johnId = SEED_USERS[0].id;
  const currentPeriod = new Date().toISOString().slice(0, 7); // e.g., '2026-05'

  // Upsert logic for SpendingSnapshot and AiInsight requires a unique constraint or predictable ID
  // We'll use fixed UUIDs for idempotency
  
  const snapshots = [
    { id: '11111111-0000-0000-0000-111111111111', category: 'Food & Dining', total: 4550n + 450n, count: 2 },
    { id: '22222222-0000-0000-0000-222222222222', category: 'Entertainment', total: 1599n, count: 1 },
  ];

  for (const snap of snapshots) {
    await prisma.spendingSnapshot.upsert({
      where: { id: snap.id },
      update: {
        total: snap.total,
        count: snap.count,
        period: currentPeriod,
      },
      create: {
        id: snap.id,
        userId: johnId,
        period: currentPeriod,
        category: snap.category,
        total: snap.total,
        count: snap.count,
      },
    });
  }

  const aiInsights = [
    {
      id: '33333333-0000-0000-0000-333333333333',
      type: 'recommendation',
      content: 'Bạn đã chi tiêu khá nhiều vào Food & Dining tuần này. Hãy cân nhắc nấu ăn tại nhà để tiết kiệm hơn.',
    },
    {
      id: '44444444-0000-0000-0000-444444444444',
      type: 'behavior',
      content: 'Thói quen chi tiêu của bạn đang tập trung vào các nhu cầu thiết yếu. Rất tốt!',
    }
  ];

  for (const insight of aiInsights) {
    await prisma.aiInsight.upsert({
      where: { id: insight.id },
      update: {
        content: insight.content,
        period: currentPeriod,
      },
      create: {
        id: insight.id,
        userId: johnId,
        type: insight.type,
        content: insight.content,
        period: currentPeriod,
      },
    });
  }

  console.log('Insight DB seeded successfully.');
}
