import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import {
  UserOrmEntity,
  SessionOrmEntity,
  CategoryOrmEntity,
  ProductOrmEntity,
  ComboItemOrmEntity,
  AddressOrmEntity,
  OrderOrmEntity,
  OrderItemOrmEntity,
} from '../infrastructure/persistence/typeorm/entities';
import { ProductImageOrmEntity } from '../infrastructure/persistence/typeorm/entities/product-image.orm-entity';

export default registerAs('database', (): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USERNAME ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
  database: process.env.DB_NAME ?? 'product_management',

  entities: [
    UserOrmEntity,
    SessionOrmEntity,
    CategoryOrmEntity,
    ProductOrmEntity,
    ProductImageOrmEntity,
    ComboItemOrmEntity,
    AddressOrmEntity,
    OrderOrmEntity,
    OrderItemOrmEntity,
  ],

  /**
   * synchronize: true SOLO en development.
   * En producción siempre usar migraciones explícitas.
   * Un synchronize: true en prod puede destruir datos al cambiar entidades.
   */
  synchronize: process.env.NODE_ENV === 'development',

  /**
   * migrationsRun: true ejecuta migraciones pendientes automáticamente al iniciar.
   * Se activa solo fuera de development donde synchronize está desactivado.
   */
  migrationsRun: process.env.NODE_ENV !== 'development',

  migrations: [__dirname + '/../migrations/*{.ts,.js}'],

  logging: process.env.NODE_ENV === 'development',

  // SSL solo en producción, en desarrollo PostgreSQL local no usa SSL
  ssl: false,
}));
