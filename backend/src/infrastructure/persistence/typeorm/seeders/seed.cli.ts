#!/usr/bin/env ts-node

/**
 * CLI para ejecutar seeders.
 * Ejecutar con: pnpm run seed:run
 */

import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { runSeeders } from './index';
import {
  UserOrmEntity,
  SessionOrmEntity,
  CategoryOrmEntity,
  ProductOrmEntity,
  ComboItemOrmEntity,
  AddressOrmEntity,
  OrderOrmEntity,
  OrderItemOrmEntity,
} from '../entities';

// Cargar variables de entorno
config();

// Configuración de DataSource para seeders
const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'product_management',
  entities: [
    UserOrmEntity,
    SessionOrmEntity,
    CategoryOrmEntity,
    ProductOrmEntity,
    ComboItemOrmEntity,
    AddressOrmEntity,
    OrderOrmEntity,
    OrderItemOrmEntity,
  ],
  synchronize: false,
  logging: true,
});

async function main() {
  console.log('🔌 Connecting to database...\n');

  try {
    await AppDataSource.initialize();
    console.log('✅ Database connected\n');

    await runSeeders(AppDataSource);

    await AppDataSource.destroy();
    console.log('\n🔌 Database connection closed');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeder failed:', error);
    process.exit(1);
  }
}

main();
