import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import {
  ProductOrmEntity,
  CategoryOrmEntity,
} from '../../../infrastructure/persistence/typeorm/entities';
import { ProductImageOrmEntity } from '../../../infrastructure/persistence/typeorm/entities/product-image.orm-entity';
import { ProductRepositoryImpl } from '../../../infrastructure/persistence/typeorm/repositories/product.repository.impl';
import { CategoryRepositoryImpl } from '../../../infrastructure/persistence/typeorm/repositories/category.repository.impl';
import {
  CreateProductUseCaseImpl,
  UpdateProductStatusUseCaseImpl,
  UpdateProductUseCaseImpl,
  DeleteProductUseCaseImpl,
} from '../../../application/use-cases/products';
import { FileUploadService } from '../../../infrastructure/file-upload/file-upload.service';
import * as DI_TOKENS from '../../../application/ports/tokens';

@Module({
  imports: [TypeOrmModule.forFeature([ProductOrmEntity, CategoryOrmEntity, ProductImageOrmEntity])],
  controllers: [ProductsController],
  providers: [
    FileUploadService,
    {
      provide: DI_TOKENS.IProductRepository,
      useClass: ProductRepositoryImpl,
    },
    {
      provide: DI_TOKENS.ICategoryRepository,
      useClass: CategoryRepositoryImpl,
    },
    {
      provide: DI_TOKENS.ICreateProductUseCase,
      useClass: CreateProductUseCaseImpl,
    },
    {
      provide: DI_TOKENS.IUpdateProductStatusUseCase,
      useClass: UpdateProductStatusUseCaseImpl,
    },
    {
      provide: DI_TOKENS.IUpdateProductUseCase,
      useClass: UpdateProductUseCaseImpl,
    },
    {
      provide: DI_TOKENS.IDeleteProductUseCase,
      useClass: DeleteProductUseCaseImpl,
    },
  ],
  exports: [
    FileUploadService,
    DI_TOKENS.IProductRepository,
    DI_TOKENS.ICategoryRepository,
    DI_TOKENS.ICreateProductUseCase,
    DI_TOKENS.IUpdateProductStatusUseCase,
    DI_TOKENS.IUpdateProductUseCase,
    DI_TOKENS.IDeleteProductUseCase,
  ],
})
export class ProductsModule {}
