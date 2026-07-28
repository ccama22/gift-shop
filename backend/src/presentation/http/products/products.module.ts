import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import {
  ProductOrmEntity,
  CategoryOrmEntity,
} from '../../../infrastructure/persistence/typeorm/entities';
import { ProductRepositoryImpl } from '../../../infrastructure/persistence/typeorm/repositories/product.repository.impl';
import { CategoryRepositoryImpl } from '../../../infrastructure/persistence/typeorm/repositories/category.repository.impl';
import * as DI_TOKENS from '../../../application/ports/tokens';

@Module({
  imports: [TypeOrmModule.forFeature([ProductOrmEntity, CategoryOrmEntity])],
  controllers: [ProductsController],
  providers: [
    {
      provide: DI_TOKENS.IProductRepository,
      useClass: ProductRepositoryImpl,
    },
    {
      provide: DI_TOKENS.ICategoryRepository,
      useClass: CategoryRepositoryImpl,
    },
  ],
  exports: [DI_TOKENS.IProductRepository, DI_TOKENS.ICategoryRepository],
})
export class ProductsModule {}
