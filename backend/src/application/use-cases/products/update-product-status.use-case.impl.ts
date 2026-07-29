import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { IUpdateProductStatusUseCase } from '../../ports/in/products';
import { ProductDomain } from '../../../domain';
import type { IProductRepository } from '../../ports/out/repositories/product.repository.interface';
import * as DI_TOKENS from '../../ports/tokens';

/**
 * Implementación del caso de uso de actualización de estado de producto.
 * Activa o desactiva un producto sin afectar su stock.
 */
@Injectable()
export class UpdateProductStatusUseCaseImpl
  implements IUpdateProductStatusUseCase
{
  constructor(
    @Inject(DI_TOKENS.IProductRepository)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(productId: string, isActive: boolean): Promise<ProductDomain> {
    // 1. Buscar el producto
    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new NotFoundException(
        `Producto con ID ${productId} no encontrado`,
      );
    }

    // 2. Activar o desactivar según corresponda
    if (isActive) {
      product.activate();
    } else {
      product.deactivate();
    }

    // 3. Guardar cambios
    const updatedProduct = await this.productRepository.save(product);

    // 4. Retornar producto actualizado
    return updatedProduct;
  }
}
