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
  imageUrl: string | null;
  components?: ComboItem[];
  createdAt: Date;
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
