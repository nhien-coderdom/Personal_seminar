import { seedAuth } from './auth-seed';
import { seedTransaction } from './transaction-seed';
import { seedInsight } from './insight-seed';
import { seedAi } from './ai-seed';

async function main() {
  console.log('=================================');
  console.log('🚀 STARTED DATABASE SEEDING PROCESS');
  console.log('=================================\n');

  try {
    await seedAuth();
    await seedTransaction();
    await seedInsight();
    await seedAi();

    console.log('\n=================================');
    console.log('✅ ALL SEEDS COMPLETED SUCCESSFULLY');
    console.log('=================================');
  } catch (error) {
    console.error('\n❌ SEEDING FAILED:');
    console.error(error);
    process.exit(1);
  }
}

main();
