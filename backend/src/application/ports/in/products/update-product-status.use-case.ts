import { ProductDomain } from '../../../../domain';

export interface IUpdateProductStatusUseCase {
  execute(productId: string, isActive: boolean): Promise<ProductDomain>;
}
