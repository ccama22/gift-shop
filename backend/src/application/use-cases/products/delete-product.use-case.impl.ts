import { Injectable, NotFoundException, Inject, BadRequestException } from '@nestjs/common';
import { IDeleteProductUseCase } from '../../ports/in/products/delete-product.use-case';
import type { IProductRepository } from '../../ports/out/repositories/product.repository.interface';
import * as DI_TOKENS from '../../ports/tokens';

/**
 * Implementación del caso de uso de eliminación lógica de productos (Soft Delete).
 * 
 * Ventajas del Soft Delete:
 * - Mantiene el historial de ventas y relaciones con órdenes
 * - Permite auditoría y trazabilidad
 * - Recuperable en caso de eliminación accidental
 * - Cumple con regulaciones de retención de datos
 * - Preserva métricas y análisis históricos
 */
@Injectable()
export class DeleteProductUseCaseImpl implements IDeleteProductUseCase {
  constructor(
    @Inject(DI_TOKENS.IProductRepository)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(productId: string): Promise<void> {
    // 1. Verificar que el producto existe
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new NotFoundException(
        `Producto con ID ${productId} no encontrado`,
      );
    }

    // 2. Validar que no esté ya eliminado
    if (product.isDeleted()) {
      throw new BadRequestException(
        'El producto ya está eliminado',
      );
    }

    // 3. Marcar como eliminado (soft delete)
    product.markAsDeleted();

    // 4. Guardar el cambio en la base de datos
    await this.productRepository.save(product);
  }
}
