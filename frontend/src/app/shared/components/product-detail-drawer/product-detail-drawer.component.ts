import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { type ProductDetailConfig, type ProductDetailResult } from '@shared/models/product-detail.model';

/**
 * Componente Drawer para mostrar detalle de producto
 * 
 * Principios SOLID:
 * - SRP: Solo muestra información detallada de un producto
 * - OCP: Extensible mediante configuración
 * - DIP: Depende de abstracciones (interfaces)
 * 
 * UX: Mobile-first, fullscreen en móvil, lateral en desktop
 */
@Component({
  selector: 'app-product-detail-drawer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail-drawer.component.html',
  styleUrl: './product-detail-drawer.component.scss'
})
export class ProductDetailDrawerComponent {
  // Inputs
  config = input<ProductDetailConfig | null>(null);
  show = input<boolean>(false);
  categories = input<any[]>([]); // Recibir categorías del padre

  // Outputs
  result = output<ProductDetailResult>();

  // URL base del servidor (para imágenes)
  private readonly SERVER_URL = 'http://localhost:3000';

  /**
   * Computed: URL completa de la imagen principal
   */
  mainImageUrl = computed(() => {
    const product = this.config()?.product;
    if (!product?.imageUrl) return this.fallbackImage;
    
    if (this.isAbsoluteUrl(product.imageUrl)) {
      return product.imageUrl;
    }
    return `${this.SERVER_URL}${product.imageUrl}`;
  });

  /**
   * Computed: Galería de imágenes
   */
  galleryImages = computed(() => {
    const product = this.config()?.product;
    if (!product?.images || product.images.length === 0) {
      return [];
    }

    return product.images
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map(img => ({
        ...img,
        fullUrl: this.isAbsoluteUrl(img.imageUrl) 
          ? img.imageUrl 
          : `${this.SERVER_URL}${img.imageUrl}`
      }));
  });

  /**
   * Imagen por defecto
   */
  readonly fallbackImage = 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=400&h=400&fit=crop';

  /**
   * Cierra el drawer
   */
  close(): void {
    this.result.emit({ action: 'close' });
  }

  /**
   * Abre edición
   */
  edit(): void {
    this.result.emit({ 
      action: 'edit', 
      productId: this.config()?.product.id 
    });
  }

  /**
   * Duplica producto
   */
  duplicate(): void {
    this.result.emit({ 
      action: 'duplicate', 
      productId: this.config()?.product.id 
    });
  }

  /**
   * Elimina producto
   */
  delete(): void {
    this.result.emit({ 
      action: 'delete', 
      productId: this.config()?.product.id 
    });
  }

  /**
   * Cierra al hacer click en el backdrop
   */
  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }

  /**
   * Maneja error de carga de imagen
   */
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = this.fallbackImage;
  }

  /**
   * Verifica si una URL es absoluta
   */
  private isAbsoluteUrl(url: string): boolean {
    return url.startsWith('http://') || 
           url.startsWith('https://') || 
           url.startsWith('data:');
  }

  /**
   * Obtiene el badge de estado
   */
  getStatusBadge(): { label: string; class: string } {
    const product = this.config()?.product;
    if (!product) return { label: '', class: '' };

    if (product.isActive && product.stock > 0) {
      return { label: 'Disponible', class: 'status--available' };
    }
    if (product.isActive && product.stock === 0) {
      return { label: 'Sin Stock', class: 'status--out-of-stock' };
    }
    return { label: 'Desactivado', class: 'status--disabled' };
  }

  /**
   * Obtiene el código del producto
   */
  getProductCode(): string {
    const product = this.config()?.product;
    if (!product) return '';
    
    if (product.sku) return product.sku;
    
    const prefix = product.name.substring(0, 3).toUpperCase();
    const suffix = product.id.substring(product.id.length - 6).toUpperCase();
    return `${prefix}-${suffix}`;
  }

  /**
   * Obtiene el nombre de la categoría
   */
  getCategoryName(): string {
    const product = this.config()?.product;
    if (!product) return 'Sin categoría';
    
    const category = this.categories().find(c => c.id === product.categoryId);
    return category?.name || 'Sin categoría';
  }
}
