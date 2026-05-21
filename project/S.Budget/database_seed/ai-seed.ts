export async function seedAi() {
  console.log('--- Seeding AI Service ---');
  // AI Service doesn't have a Prisma database setup based on architecture.
  // It acts as a stateless proxy to OpenAI/Cloudinary or caches in Redis.
  // We just add a dummy successful output for completeness of the seed process.
  console.log('AI Service requires no database seeding. Skipping...');
}
