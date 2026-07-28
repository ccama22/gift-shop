import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface FilterState {
  categories: string[];
  priceValue: number;
  occasion: string;
}

@Component({
  selector: 'app-product-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-filters.component.html',
  styleUrl: './product-filters.component.scss'
})
export class ProductFiltersComponent {
  @Output() filtersChanged = new EventEmitter<FilterState>();

  selectedCategories: string[] = [];
  priceValue = 250; // Valor medio del slider
  selectedOccasion = '';

  categories = [
    { id: 'bouquets', label: 'Ramos' },
    { id: 'chocolates', label: 'Chocolates' },
    { id: 'combos', label: 'Combos' }
  ];

  occasions = [
    { id: 'birthday', label: 'Cumpleaños' },
    { id: 'anniversary', label: 'Aniversario' },
    { id: 'valentines', label: 'Día de San Valentín' },
    { id: 'mothers-day', label: 'Día de la Madre' },
    { id: 'graduation', label: 'Graduación' }
  ];

  onCategoryChange(categoryId: string, checked: boolean): void {
    if (checked) {
      this.selectedCategories.push(categoryId);
    } else {
      this.selectedCategories = this.selectedCategories.filter(id => id !== categoryId);
    }
    this.emitFilters();
  }

  onPriceChange(): void {
    this.emitFilters();
  }

  onOccasionChange(): void {
    this.emitFilters();
  }

  getSliderProgress(): number {
    return ((this.priceValue - 25) / (500 - 25)) * 100;
  }

  private emitFilters(): void {
    this.filtersChanged.emit({
      categories: this.selectedCategories,
      priceValue: this.priceValue,
      occasion: this.selectedOccasion
    });
  }
}
