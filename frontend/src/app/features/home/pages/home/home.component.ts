import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// Componentes
import { HeroComponent } from '../../components/hero/hero.component';
import { ProductFiltersComponent, FilterState } from '../../components/product-filters/product-filters.component';
import { ProductGridComponent, Product } from '../../components/product-grid/product-grid.component';

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
export class HomeComponent {
  allProducts: Product[] = [
    {
      id: 1,
      name: 'Rose & Teddy Bouquet',
      description: 'Ramo elegante con rosas premium y osito de peluche',
      price: 85.00,
      image: 'https://images.unsplash.com/photo-1606800052052-452d5c61c4b7?w=500&h=500&fit=crop',
      badge: 'Hot Deal',
      rating: 5,
      reviews: 42,
      category: 'bouquets',
      occasion: 'birthday'
    },
    {
      id: 2,
      name: 'Gourmet Chocolate Box',
      description: 'Caja premium con 24 chocolates artesanales belgas',
      price: 42.00,
      image: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=500&h=500&fit=crop',
      rating: 5,
      reviews: 128,
      category: 'chocolates',
      occasion: 'valentines'
    },
    {
      id: 3,
      name: 'Birthday Surprise Combo',
      description: 'Combinación perfecta de flores y chocolates',
      price: 120.00,
      image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&h=500&fit=crop',
      rating: 5,
      reviews: 89,
      category: 'combos',
      occasion: 'birthday'
    },
    {
      id: 4,
      name: 'Elegant Lily Arrangement',
      description: 'Arreglo sofisticado de lirios blancos',
      price: 65.00,
      image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=500&h=500&fit=crop',
      rating: 4,
      reviews: 56,
      category: 'bouquets',
      occasion: 'anniversary'
    },
    {
      id: 5,
      name: 'Artisan Truffle Collection',
      description: 'Selección exclusiva de trufas gourmet',
      price: 58.00,
      image: 'https://images.unsplash.com/photo-1548848979-47519fe7dbae?w=500&h=500&fit=crop',
      badge: 'New',
      rating: 5,
      reviews: 34,
      category: 'chocolates',
      occasion: 'anniversary'
    },
    {
      id: 6,
      name: 'Anniversary Premium Set',
      description: 'Set romántico con rosas rojas y chocolates',
      price: 145.00,
      image: 'https://images.unsplash.com/photo-1565024108888-ec82c58f722f?w=500&h=500&fit=crop',
      rating: 5,
      reviews: 167,
      category: 'combos',
      occasion: 'anniversary'
    },
    {
      id: 7,
      name: 'Spring Garden Bouquet',
      description: 'Mezcla fresca de flores de temporada',
      price: 72.00,
      image: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=500&h=500&fit=crop',
      rating: 4,
      reviews: 73,
      category: 'bouquets',
      occasion: 'mothers-day'
    },
    {
      id: 8,
      name: 'Luxury Gift Hamper',
      description: 'Canasta premium con chocolates y vino',
      price: 195.00,
      image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&h=500&fit=crop',
      badge: 'Bestseller',
      rating: 5,
      reviews: 201,
      category: 'combos',
      occasion: 'graduation'
    }
  ];

  filteredProducts: Product[] = [...this.allProducts];

  onFiltersChange(filters: FilterState): void {
    // Aplicar filtros
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