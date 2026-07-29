/**
 * Modelos de Producto - Alineados con el backend
 */

export interface ComboItem {
  comboId: string;
  productId: string;
  quantity: number;
  productName?: string;
  productPrice?: number;
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  isCombo: boolean;
  isActive: boolean;
  canBeSold?: boolean;
  imageUrl: string | null;
  images?: ProductImage[];
  sku: string | null;
  tags: string[];
  lowStockAlert: number;
  components?: ComboItem[];
  createdAt: Date;
}

export interface ProductImage {
  id: string;
  imageUrl: string;
  displayOrder: number;
  isPrimary: boolean;
}

export interface CreateProductRequest {
  name: string;
  description?: string;
  price: number;
  stock: number;
  categoryId: string;
  isActive?: boolean;
  imageUrl?: string;
  lowStockAlert?: number;
  sku?: string;
  tags?: string[];
  isCombo?: boolean;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  categoryId?: string;
  isActive?: boolean;
  imageUrl?: string;
  lowStockAlert?: number;
  sku?: string;
  tags?: string[];
  isCombo?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

/**
 * Parámetros para filtrado de productos
 */
export interface ProductFilters {
  categoryId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

/**
 * Respuesta paginada de productos
 */
export interface PaginatedProducts {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
