import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '@core/services/auth.service';
import { ProductService } from '@core/services/product.service';
import { Product, Category } from '@core/models/product.model';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss'
})
export class InventoryComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly productService = inject(ProductService);
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

  /**
   * Obtener imagen del producto o placeholder
   */
  getProductImage(product: Product): string {
    return product.imageUrl || 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=100&h=100&fit=crop';
  }

  /**
   * Verificar si el producto está activo (tiene stock)
   */
  isProductActive(product: Product): boolean {
    return product.stock > 0;
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
}
