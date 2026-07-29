export class ComboItemResponseDto {
  comboId!: string;
  productId!: string;
  quantity!: number;
  productName?: string;
  productPrice?: number;
}

export class ProductImageDto {
  id!: string;
  imageUrl!: string;
  displayOrder!: number;
  isPrimary!: boolean;
}

export class ProductResponseDto {
  id!: string;
  categoryId!: string;
  name!: string;
  description!: string | null;
  price!: number;
  stock!: number;
  isCombo!: boolean;
  isActive!: boolean;
  imageUrl!: string | null;
  images!: ProductImageDto[];
  sku!: string | null;
  tags!: string[];
  lowStockAlert!: number;
  components?: ComboItemResponseDto[];
  canBeSold?: boolean;
  createdAt!: Date;
}
