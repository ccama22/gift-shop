export class ComboItemResponseDto {
  comboId!: string;
  productId!: string;
  quantity!: number;
  productName?: string;
  productPrice?: number;
}

export class ProductResponseDto {
  id!: string;
  categoryId!: string;
  name!: string;
  description!: string | null;
  price!: number;
  stock!: number;
  isCombo!: boolean;
  imageUrl!: string | null;
  components?: ComboItemResponseDto[];
  createdAt!: Date;
}
