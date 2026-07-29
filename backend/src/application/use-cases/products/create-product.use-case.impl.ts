import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import {
  ICreateProductUseCase,
  CreateProductDto,
} from '../../ports/in/products';
import { ProductDomain } from '../../../domain';
import type { IProductRepository } from '../../ports/out/repositories/product.repository.interface';
import type { ICategoryRepository } from '../../ports/out/repositories/category.repository.interface';
import * as DI_TOKENS from '../../ports/tokens';

/**
 * Implementación del caso de uso de creación de productos.
 * Valida que la categoría exista y crea un nuevo producto.
 */
@Injectable()
export class CreateProductUseCaseImpl implements ICreateProductUseCase {
  constructor(
    @Inject(DI_TOKENS.IProductRepository)
    private readonly productRepository: IProductRepository,
    @Inject(DI_TOKENS.ICategoryRepository)
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async execute(dto: CreateProductDto): Promise<ProductDomain> {
    // 1. Validar que la categoría existe
    const category = await this.categoryRepository.findById(dto.categoryId);
    if (!category) {
      throw new NotFoundException(
        `Categoría con ID ${dto.categoryId} no encontrada`,
      );
    }

    // 2. Validar datos básicos (ProductDomain.create ya hace validaciones)
    // 3. Crear el producto con estado isActive por defecto en true
    const product = ProductDomain.create({
      id: dto.id,
      categoryId: dto.categoryId,
      name: dto.name,
      description: dto.description ?? null,
      price: dto.price,
      stock: dto.stock,
      isCombo: dto.isCombo ?? false,
      imageUrl: dto.imageUrl ?? null,
      isActive: dto.isActive ?? true,
      sku: dto.sku ?? null,
      tags: dto.tags ?? [],
      lowStockAlert: dto.lowStockAlert ?? 10,
      components: [],
    });

    // 4. Guardar el producto
    const savedProduct = await this.productRepository.save(product);

    // 5. Retornar producto creado
    return savedProduct;
  }
}
