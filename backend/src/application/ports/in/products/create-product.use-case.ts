import { ProductDomain } from '../../../../domain';

export interface CreateProductDto {
  id: string;
  categoryId: string;
  name: string;
  description?: string | null;
  price: number;
  stock: number;
  isActive?: boolean;
  isCombo?: boolean;
  imageUrl?: string | null;
  lowStockAlert?: number;
  sku?: string;
  tags?: string[];
}

export interface ICreateProductUseCase {
  execute(dto: CreateProductDto): Promise<ProductDomain>;
}
