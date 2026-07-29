import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

// Componentes
import { HeroComponent } from '../../components/hero/hero.component';
import { ProductFiltersComponent, FilterState } from '../../components/product-filters/product-filters.component';
import { ProductGridComponent, Product } from '../../components/product-grid/product-grid.component';

// Servicios
import { ProductService } from '@core/services/product.service';
import { Product as BackendProduct } from '@core/models/product.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeroComponent,
    ProductFiltersComponent,
    ProductGridComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly cdr = inject(ChangeDetectorRef);

  allProducts: Product[] = [];
  filteredProducts: Product[] = [];
  isLoading = false;
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.loadProducts();
  }

  /**
   * Cargar productos desde el backend
   */
  loadProducts(): void {
    this.isLoading = true;
    this.errorMessage = null;
    
    // Timeout de 10 segundos para evitar carga infinita
    const timeoutId = setTimeout(() => {
      if (this.isLoading) {
        this.isLoading = false;
        this.errorMessage = 'La petición tardó demasiado. Verifica tu conexión o recarga la página.';
        this.cdr.detectChanges();
      }
    }, 10000);
    
    this.productService.loadProducts().subscribe({
      next: (backendProducts) => {
        clearTimeout(timeoutId);
        
        // Mapear productos del backend al formato del componente
        this.allProducts = backendProducts
          .filter(p => p.isActive) // Solo productos activos
          .map(p => this.mapBackendProduct(p));
        
        this.filteredProducts = [...this.allProducts];
        this.isLoading = false;
        
        // Forzar detección de cambios
        this.cdr.detectChanges();
      },
      error: (error) => {
        clearTimeout(timeoutId);
        
        // Mensaje amigable según el tipo de error
        if (error.status === 0) {
          this.errorMessage = 'No se puede conectar al servidor. Verifica que el backend esté corriendo en http://localhost:3000';
        } else if (error.status === 404) {
          this.errorMessage = 'Endpoint de productos no encontrado';
        } else {
          this.errorMessage = error.message || 'Error al cargar productos';
        }
        
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * Mapear producto del backend al formato del componente
   */
  private mapBackendProduct(product: BackendProduct): Product {
    // Determinar imagen a usar (primaria o la principal)
    const primaryImage = product.images?.find(img => img.isPrimary);
    const imageUrl = primaryImage?.imageUrl || product.imageUrl || 'https://via.placeholder.com/500';
    
    // Construir URL completa de la imagen si es necesario
    const fullImageUrl = imageUrl.startsWith('http') 
      ? imageUrl 
      : `${this.productService.SERVER_URL}${imageUrl}`;

    return {
      id: parseInt(product.id, 10) || 0,
      name: product.name,
      description: product.description || '',
      price: product.price,
      image: fullImageUrl,
      badge: this.getBadgeForProduct(product),
      rating: 5,
      reviews: Math.floor(Math.random() * 100) + 10,
      category: product.categoryId,
      occasion: this.getOccasionFromTags(product.tags)
    };
  }

  /**
   * Determinar badge basado en las características del producto
   */
  private getBadgeForProduct(product: BackendProduct): string | undefined {
    if (product.tags.includes('bestseller')) return 'Bestseller';
    if (product.tags.includes('hot-deal')) return 'Hot Deal';
    if (product.tags.includes('new')) return 'New';
    if (product.isCombo) return 'Combo';
    return undefined;
  }

  /**
   * Obtener ocasión desde los tags del producto
   */
  private getOccasionFromTags(tags: string[]): string | undefined {
    const occasions = ['birthday', 'anniversary', 'valentines', 'mothers-day', 'graduation'];
    return tags.find(tag => occasions.includes(tag));
  }

  /**
   * Manejar cambio de filtros
   */
  onFiltersChange(filters: FilterState): void {
    this.filteredProducts = this.allProducts.filter(product => {
      // Filtro de categoría
      const matchesCategory = filters.categories.length === 0 || 
        filters.categories.includes(product.category || '');
      
      // Filtro de precio
      const matchesPrice = product.price <= filters.priceValue;
      
      // Filtro de ocasión
      const matchesOccasion = !filters.occasion || 
        product.occasion === filters.occasion;
      
      return matchesCategory && matchesPrice && matchesOccasion;
    });
  }
}