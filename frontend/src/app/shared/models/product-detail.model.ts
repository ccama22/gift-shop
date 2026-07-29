import { Product } from '@core/models/product.model';

/**
 * Configuración del drawer de detalle de producto
 */
export interface ProductDetailConfig {
  product: Product;
  showActions?: boolean; // Mostrar botones de acción (Editar, Duplicar, etc.)
}

/**
 * Resultado del drawer (acción realizada)
 */
export interface ProductDetailResult {
  action: 'edit' | 'duplicate' | 'delete' | 'close';
  productId?: string;
}
