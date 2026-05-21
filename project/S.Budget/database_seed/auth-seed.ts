import { PrismaClient } from '../node_modules/.prisma/auth-client';
import { SEED_USERS } from './constants';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function seedAuth() {
  console.log('--- Seeding Auth DB ---');
  
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash('password123', salt);

  for (const user of SEED_USERS) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        password: hash,
      },
      create: {
        id: user.id,
        email: user.email,
        name: user.name,
        password: hash,
      },
    });
  }
  
  console.log('Auth DB seeded successfully.');
}
