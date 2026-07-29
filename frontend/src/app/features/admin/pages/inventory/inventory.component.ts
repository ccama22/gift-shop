import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '@core/services/auth.service';
import { ProductService } from '@core/services/product.service';
import { DialogService } from '@core/services/dialog.service';
import { Product, Category } from '@core/models/product.model';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { ProductDetailDrawerComponent } from '@shared/components/product-detail-drawer/product-detail-drawer.component';
import { type ProductDetailConfig, type ProductDetailResult } from '@shared/models/product-detail.model';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmationDialogComponent, ProductDetailDrawerComponent],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss'
})
export class InventoryComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly productService = inject(ProductService);
  private readonly dialogService = inject(DialogService);
  private readonly router = inject(Router);

  // ============================================
  // SIGNALS del Servicio de Productos
  // ============================================
  readonly products = this.productService.filteredProducts;
  readonly categories = this.productService.categories;
  readonly loading = this.productService.loading;
  readonly error = this.productService.error;
  readonly totalProducts = this.productService.totalProductsCount;
  readonly activeProducts = this.productService.activeProductsCount;
  readonly outOfStockProducts = this.productService.outOfStockCount;

  // ============================================
  // SIGNALS Locales
  // ============================================
  readonly searchTerm = signal<string>('');
  readonly selectedCategory = signal<string | null>(null);

  // ============================================
  // Usuario Autenticado
  // ============================================
  readonly currentUser = this.authService.currentUser;

  // ============================================
  // Dialog Service Signals
  // ============================================
  readonly dialogConfig = this.dialogService.config;
  readonly showDialog = this.dialogService.show;

  // ============================================
  // Product Detail Drawer Signals
  // ============================================
  readonly detailConfig = signal<ProductDetailConfig | null>(null);
  readonly showDetail = signal<boolean>(false);

  // ============================================
  // LIFECYCLE
  // ============================================
  ngOnInit(): void {
    // Cargar datos iniciales
    this.loadData();
  }

  // ============================================
  // MÉTODOS PÚBLICOS
  // ============================================

  /**
   * Cargar productos y categorías desde la base de datos
   */
  loadData(): void {
    this.productService.loadProducts().subscribe();
    this.productService.loadCategories().subscribe();
  }

  /**
   * Buscar productos
   */
  onSearch(term: string): void {
    this.searchTerm.set(term);
    this.productService.setSearchFilter(term);
  }

  /**
   * Filtrar por categoría
   */
  onCategoryFilter(categoryId: string | null): void {
    this.selectedCategory.set(categoryId);
    this.productService.setSelectedCategory(categoryId);
  }

  /**
   * Limpiar filtros
   */
  clearFilters(): void {
    this.searchTerm.set('');
    this.selectedCategory.set(null);
    this.productService.clearFilters();
  }

  /**
   * Refrescar datos
   */
  refresh(): void {
    this.loadData();
  }

  /**
   * Obtener nombre de categoría por ID
   */
  getCategoryName(categoryId: string): string {
    const category = this.categories().find(c => c.id === categoryId);
    return category?.name || 'Sin categoría';
  }

  /**
   * Generar código único del producto (primeras 3 letras + últimos 6 del UUID)
   */
  getProductCode(product: Product): string {
    const prefix = product.name.substring(0, 3).toUpperCase();
    const suffix = product.id.substring(product.id.length - 6).toUpperCase();
    return `${prefix}-${suffix}`;
  }

  readonly fallbackImage = 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=100&h=100&fit=crop';

  /**
   * Obtener imagen del producto (si es relativa, agregar el origen del backend)
   */
  getProductImage(product: Product): string {
    if (!product.imageUrl) {
      return this.fallbackImage;
    }
    if (
      product.imageUrl.startsWith('http://') ||
      product.imageUrl.startsWith('https://') ||
      product.imageUrl.startsWith('data:')
    ) {
      return product.imageUrl;
    }
    return `${this.productService.SERVER_URL}${product.imageUrl}`;
  }

  /**
   * Manejar error al cargar la imagen
   */
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = this.fallbackImage;
  }

  /**
   * Verificar si el producto está activo (isActive)
   */
  isProductActive(product: Product): boolean {
    return product.isActive;
  }

  /**
   * Cambiar estado de activación del producto
   */
  toggleProductStatus(product: Product, event: Event): void {
    event.stopPropagation();
    const newStatus = !product.isActive;

    this.productService.updateProductStatus(product.id, newStatus).subscribe({
      next: () => {
        // Estado actualizado automáticamente por signals
      },
      error: (err) => {
        console.error('Error al cambiar estado:', err);
        alert('No se pudo cambiar el estado del producto');
      }
    });
  }

  /**
   * Obtener badge y etiqueta de estado detallada
   */
  getProductStatusBadge(product: Product): { label: string; class: string } {
    if (product.isActive && product.stock > 0) {
      return { label: 'Disponible', class: 'status-badge--available' };
    }
    if (product.isActive && product.stock === 0) {
      return { label: 'Sin Stock', class: 'status-badge--out-of-stock' };
    }
    return { label: 'Desactivado', class: 'status-badge--disabled' };
  }

  /**
   * Cerrar sesión
   */
  onLogout(): void {
    this.authService.logout();
  }

  /**
   * Navegar al formulario de producto
   */
  navigateToProductForm(): void {
    this.router.navigate(['/admin/product/new']);
  }

  /**
   * Navegar a editar producto
   */
  navigateToEditProduct(productId: string): void {
    this.router.navigate(['/admin/product/edit', productId]);
  }

  /**
   * Eliminar producto (Soft Delete) con modal personalizado
   */
  async deleteProduct(product: Product): Promise<void> {
    // Mostrar diálogo de confirmación usando el servicio
    const result = await this.dialogService.confirmDelete(product.name, 'Producto');

    // Si el usuario confirmó, proceder con la eliminación
    if (result.confirmed) {
      this.productService.deleteProduct(product.id).subscribe({
        next: () => {
          // El signal se actualizará automáticamente
        },
        error: (err) => {
          console.error('❌ Error al archivar producto:', err);
          alert(`Error al archivar el producto: ${err.error?.message || err.message || 'Error desconocido'}`);
        }
      });
    }
  }

  /**
   * Maneja el resultado del diálogo
   */
  onDialogResult(result: any): void {
    this.dialogService.handleResult(result);
  }

  /**
   * Muestra el detalle del producto en el drawer
   */
  viewProductDetail(product: Product): void {
    this.detailConfig.set({
      product,
      showActions: true
    });
    this.showDetail.set(true);
  }

  /**
   * Maneja el resultado del drawer de detalle
   */
  onDetailResult(result: ProductDetailResult): void {
    this.showDetail.set(false);

    switch (result.action) {
      case 'edit':
        if (result.productId) {
          this.navigateToEditProduct(result.productId);
        }
        break;
      case 'duplicate':
        if (result.productId) {
          this.duplicateProduct(result.productId);
        }
        break;
      case 'delete':
        if (result.productId) {
          const product = this.products().find(p => p.id === result.productId);
          if (product) {
            this.deleteProduct(product);
          }
        }
        break;
      case 'close':
        // Solo cerrar
        break;
    }

    // Limpiar config después de animación
    setTimeout(() => {
      this.detailConfig.set(null);
    }, 300);
  }

  /**
   * Duplica un producto (placeholder - implementar después)
   */
  duplicateProduct(productId: string): void {
    alert('Función de duplicación - Por implementar');
    // TODO: Implementar duplicación de producto
  }
}
