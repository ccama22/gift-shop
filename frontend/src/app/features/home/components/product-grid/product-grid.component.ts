import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  badge?: string;
  rating: number;
  reviews: number;
  category?: string;
  occasion?: string;
}

@Component({
  selector: 'app-product-grid',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-grid.component.html',
  styleUrl: './product-grid.component.scss'
})
export class ProductGridComponent {
  @Input() products: Product[] = [];
  
  viewMode: 'grid' | 'list' = 'grid';
  sortBy = 'featured';

  onSortChange(): void {
    // Crear copia para no mutar el array original
    let sorted = [...this.products];
    
    switch(this.sortBy) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'featured':
      default:
        // No ordenar, mantener orden original
        break;
    }
    
    this.products = sorted;
  }

  onAddToCart(product: Product): void {
    // TODO: Implement add to cart
  }
}
