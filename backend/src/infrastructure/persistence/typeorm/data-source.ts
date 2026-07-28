import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import {
  UserOrmEntity,
  SessionOrmEntity,
  CategoryOrmEntity,
  ProductOrmEntity,
  ComboItemOrmEntity,
  AddressOrmEntity,
  OrderOrmEntity,
  OrderItemOrmEntity,
} from './entities';

// Cargar variables de entorno
config();

/**
 * DataSource para TypeORM CLI (migraciones).
 * Este archivo es usado por los comandos de migración:
 * - pnpm run migration:generate
 * - pnpm run migration:run
 * - pnpm run migration:revert
 */
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'product_management',

  // Entidades
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

  // Migraciones
  migrations: ['src/infrastructure/persistence/typeorm/migrations/*.ts'],
  migrationsTableName: 'migrations_history',

  // Configuración
  synchronize: false, // NUNCA usar true en producción
  logging: process.env.NODE_ENV === 'development',
});
