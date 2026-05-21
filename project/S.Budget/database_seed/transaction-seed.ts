import { PrismaClient } from '../node_modules/.prisma/transaction-client';
import { SEED_USERS, SEED_CATEGORIES } from './constants';

const prisma = new PrismaClient();

export async function seedTransaction() {
  console.log('--- Seeding Transaction DB ---');

  for (const category of SEED_CATEGORIES) {
    await prisma.category.upsert({
      where: { id: category.id },
      update: {
        name: category.name,
        icon: category.icon,
        color: category.color,
      },
      create: category,
    });
  }

  // Generate realistic transactions for John Doe
  const johnId = SEED_USERS[0].id;
  
  // Mix of manual and OCR transactions for better testing
  const transactions = [
    // Manual transactions
    { id: 't1', amount: 4550n, type: 'expense', categoryId: SEED_CATEGORIES[0].id, note: 'Groceries', source: 'manual', imageUrl: null, date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
    { id: 't2', amount: 300000n, type: 'income', categoryId: SEED_CATEGORIES[3].id, note: 'Salary', source: 'manual', imageUrl: null, date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
    { id: 't3', amount: 1599n, type: 'expense', categoryId: SEED_CATEGORIES[2].id, note: 'Netflix', source: 'manual', imageUrl: null, date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
    { id: 't4', amount: 450n, type: 'expense', categoryId: SEED_CATEGORIES[0].id, note: 'Coffee', source: 'manual', imageUrl: null, date: new Date() },
    
    // OCR transactions (with placeholder images for testing)
    { id: 't5', amount: 2500n, type: 'expense', categoryId: SEED_CATEGORIES[1].id, note: 'Gas', source: 'ocr', imageUrl: 'https://placehold.co/150/png?text=Gas+Receipt', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
    { id: 't6', amount: 1200n, type: 'expense', categoryId: SEED_CATEGORIES[0].id, note: 'Restaurant', source: 'ocr', imageUrl: 'https://placehold.co/150/png?text=Food+Receipt', date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) },
    { id: 't7', amount: 3800n, type: 'expense', categoryId: SEED_CATEGORIES[0].id, note: 'Shopping', source: 'ocr', imageUrl: 'https://placehold.co/150/png?text=Receipt', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
  ];

  for (const tx of transactions) {
    // Use predefined UUID for idempotency
    const uuid = `00000000-0000-0000-0000-00000000000${tx.id.replace('t', '')}`;
    
    await prisma.transaction.upsert({
      where: { id: uuid },
      update: {
        amount: tx.amount,
        type: tx.type,
        categoryId: tx.categoryId,
        note: tx.note,
        source: tx.source,
        imageUrl: tx.imageUrl,
        date: tx.date,
      },
      create: {
        id: uuid,
        userId: SEED_USERS[0].id, // Seed for John Doe
        amount: tx.amount,
        type: tx.type,
        categoryId: tx.categoryId,
        note: tx.note,
        source: tx.source,
        imageUrl: tx.imageUrl,
        date: tx.date,
      },
    });
  }

  console.log('Transaction DB seeded successfully.');
}
