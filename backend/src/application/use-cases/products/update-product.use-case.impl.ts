import { Injectable, NotFoundException, Inject, BadRequestException } from '@nestjs/common';
import { IUpdateProductUseCase, UpdateProductCommand } from '../../ports/in/products';
import { ProductDomain } from '../../../domain';
import type { IProductRepository } from '../../ports/out/repositories/product.repository.interface';
import type { ICategoryRepository } from '../../ports/out/repositories/category.repository.interface';
import * as DI_TOKENS from '../../ports/tokens';

/**
 * Implementación del caso de uso de actualización de producto.
 * Actualiza los datos generales del producto.
 */
@Injectable()
export class UpdateProductUseCaseImpl implements IUpdateProductUseCase {
  constructor(
    @Inject(DI_TOKENS.IProductRepository)
    private readonly productRepository: IProductRepository,
    @Inject(DI_TOKENS.ICategoryRepository)
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async execute(id: string, command: UpdateProductCommand): Promise<ProductDomain> {
    // 1. Buscar el producto
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    // 2. Validar categoría si se está actualizando
    if (command.categoryId) {
      const category = await this.categoryRepository.findById(command.categoryId);
      if (!category) {
        throw new BadRequestException(`Categoría con ID ${command.categoryId} no encontrada`);
      }
    }

    // 3. Validar SKU único si se está actualizando
    if (command.sku && command.sku !== product.getSku()) {
      const existingProduct = await this.productRepository.findBySku(command.sku);
      if (existingProduct && existingProduct.getId() !== id) {
        throw new BadRequestException(`El SKU ${command.sku} ya está en uso por otro producto`);
      }
    }

    // 4. Actualizar detalles del producto
    product.updateDetails({
      name: command.name,
      description: command.description,
      price: command.price,
      stock: command.stock,
      imageUrl: command.imageUrl,
      sku: command.sku,
      tags: command.tags,
      lowStockAlert: command.lowStockAlert,
    });

    // 5. Actualizar estado si se especifica
    if (command.isActive !== undefined) {
      if (command.isActive) {
        product.activate();
      } else {
        product.deactivate();
      }
    }

    // 6. Guardar cambios
    const updatedProduct = await this.productRepository.save(product);

    // 7. Retornar producto actualizado
    return updatedProduct;
  }
}
