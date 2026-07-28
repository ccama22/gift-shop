import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap, catchError, of, finalize } from 'rxjs';
import { Product, Category, ProductFilters } from '@core/models/product.model';

/**
 * ProductService - Servicio para gestión de productos con Signals
 * 
 * Este servicio usa Angular Signals para manejo de estado reactivo:
 * - Signals: Estado reactivo y mutable con change detection automática
 * - Computed: Valores derivados que se recalculan automáticamente
 * - Effect: Reaccionar a cambios en signals (no usado aquí, pero disponible)
 */
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:3000/api';

  // ============================================
  // SIGNALS - Estado Reactivo
  // ============================================
  
  /**
   * Signal: Lista de productos cargados
   * Los signals son contenedores de estado que notifican automáticamente
   * cuando su valor cambia, triggereando change detection en componentes.
   */
  private readonly productsSignal = signal<Product[]>([]);
  
  /**
   * Signal: Lista de categorías
   */
  private readonly categoriesSignal = signal<Category[]>([]);
  
  /**
   * Signal: Estado de carga
   */
  private readonly loadingSignal = signal<boolean>(false);
  
  /**
   * Signal: Error si existe
   */
  private readonly errorSignal = signal<string | null>(null);
  
  /**
   * Signal: Filtro de búsqueda actual
   */
  private readonly searchFilterSignal = signal<string>('');
  
  /**
   * Signal: Categoría seleccionada
   */
  private readonly selectedCategorySignal = signal<string | null>(null);

  // ============================================
  // COMPUTED SIGNALS - Valores Derivados
  // ============================================
  
  /**
   * Computed: Productos filtrados
   * Se recalcula automáticamente cuando cambian los signals de los que depende
   */
  public readonly filteredProducts = computed(() => {
    const products = this.productsSignal();
    const search = this.searchFilterSignal().toLowerCase();
    const categoryId = this.selectedCategorySignal();

    let filtered = products;

    // Filtrar por categoría
    if (categoryId) {
      filtered = filtered.filter(p => p.categoryId === categoryId);
    }

    // Filtrar por búsqueda
    if (search) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(search) ||
        p.description?.toLowerCase().includes(search) ||
        false
      );
    }

    return filtered;
  });

  /**
   * Computed: Total de productos activos (con stock > 0)
   */
  public readonly activeProductsCount = computed(() => {
    return this.productsSignal().filter(p => p.stock > 0).length;
  });

  /**
   * Computed: Total de productos sin stock
   */
  public readonly outOfStockCount = computed(() => {
    return this.productsSignal().filter(p => p.stock === 0).length;
  });

  /**
   * Computed: Total de productos
   */
  public readonly totalProductsCount = computed(() => {
    return this.productsSignal().length;
  });

  // ============================================
  // GETTERS PÚBLICOS - Exponer Signals
  // ============================================
  
  public readonly products = this.productsSignal.asReadonly();
  public readonly categories = this.categoriesSignal.asReadonly();
  public readonly loading = this.loadingSignal.asReadonly();
  public readonly error = this.errorSignal.asReadonly();
  public readonly searchFilter = this.searchFilterSignal.asReadonly();
  public readonly selectedCategory = this.selectedCategorySignal.asReadonly();

  // ============================================
  // MÉTODOS PÚBLICOS
  // ============================================

  /**
   * Cargar todos los productos
   */
  loadProducts(filters?: ProductFilters): Observable<Product[]> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    let params = new HttpParams();
    if (filters?.categoryId) {
      params = params.set('categoryId', filters.categoryId);
    }

    return this.http.get<Product[]>(`${this.API_URL}/products`, { params }).pipe(
      tap(products => {
        this.productsSignal.set(products);
      }),
      catchError(error => {
        console.error('Error cargando productos:', error);
        this.errorSignal.set('Error al cargar productos. Por favor intenta de nuevo.');
        return of([]);
      }),
      finalize(() => {
        this.loadingSignal.set(false);
      })
    );
  }

  /**
   * Cargar categorías
   */
  loadCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.API_URL}/products/categories`).pipe(
      tap(categories => {
        this.categoriesSignal.set(categories);
      }),
      catchError(error => {
        console.error('Error cargando categorías:', error);
        return of([]);
      })
    );
  }

  /**
   * Obtener un producto por ID
   */
  getProductById(id: string): Observable<Product | null> {
    return this.http.get<Product>(`${this.API_URL}/products/${id}`).pipe(
      catchError(error => {
        console.error(`Error cargando producto ${id}:`, error);
        return of(null);
      })
    );
  }

  /**
   * Actualizar filtro de búsqueda
   */
  setSearchFilter(search: string): void {
    this.searchFilterSignal.set(search);
  }

  /**
   * Actualizar categoría seleccionada
   */
  setSelectedCategory(categoryId: string | null): void {
    this.selectedCategorySignal.set(categoryId);
  }

  /**
   * Limpiar filtros
   */
  clearFilters(): void {
    this.searchFilterSignal.set('');
    this.selectedCategorySignal.set(null);
  }

  /**
   * Refrescar datos
   */
  refresh(): Observable<Product[]> {
    return this.loadProducts();
  }
}
