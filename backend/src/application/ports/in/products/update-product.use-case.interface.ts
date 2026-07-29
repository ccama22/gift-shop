import { ProductDomain } from '../../../../domain';

export interface UpdateProductCommand {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  categoryId?: string;
  isActive?: boolean;
  isCombo?: boolean;
  imageUrl?: string;
  lowStockAlert?: number;
  sku?: string;
  tags?: string[];
}

export interface IUpdateProductUseCase {
  execute(id: string, command: UpdateProductCommand): Promise<ProductDomain>;
}
