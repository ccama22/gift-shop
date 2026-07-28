import { DataSource } from 'typeorm';
import { seedUsers } from './user.seeder';
import { seedCatalog } from './catalog.seeder';

/**
 * Ejecutor principal de seeders.
 * Ejecuta todos los seeders en orden.
 */
export async function runSeeders(dataSource: DataSource): Promise<void> {
  console.log('🚀 Starting seeders...\n');

  try {
    await seedUsers(dataSource);
    await seedCatalog(dataSource);

    console.log('\n✅ All seeders completed successfully!');
  } catch (error) {
    console.error('❌ Error running seeders:', error);
    throw error;
  }
}
