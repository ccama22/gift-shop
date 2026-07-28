import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '@core/services/product.service';
import { Category } from '@core/models/product.model';

interface ProductForm {
  name: string;
  description: string;
  price: number | null;
  stock: number | null;
  categoryId: string;
  imageUrl: string;
  isCombo: boolean;
  lowStockAlert: number;
  sku: string;
  tags: string[];
}

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly productService = inject(ProductService);

  // ============================================
  // SIGNALS
  // ============================================
  readonly categories = this.productService.categories;
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  readonly newTag = signal<string>('');
  
  // ============================================
  // PRODUCT IMAGES - Galería completa
  // ============================================
  readonly productImages = signal<{
    main: string | null;
    gallery: string[];
  }>({
    main: null,
    gallery: []
  });
  
  readonly maxGalleryImages = 4;
  
  readonly formData = signal<ProductForm>({
    name: '',
    description: '',
    price: null,
    stock: null,
    categoryId: '',
    imageUrl: '',
    isCombo: false,
    lowStockAlert: 10,
    sku: '',
    tags: []
  });

  // ============================================
  // LIFECYCLE
  // ============================================
  ngOnInit(): void {
    this.productService.loadCategories().subscribe();
    this.generateSKU();
  }

  // ============================================
  // MÉTODOS
  // ============================================

  /**
   * Generar SKU automático
   */
  generateSKU(): void {
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
    const skuFormat = `VV-${randomPart}`;
    this.formData.update(data => ({ ...data, sku: skuFormat }));
  }

  /**
   * Verificar validez del formulario
   */
  isFormValid(): boolean {
    const data = this.formData();
    return !!(
      data.name.trim() &&
      data.categoryId &&
      data.price !== null && 
      data.price > 0 &&
      data.stock !== null && 
      data.stock >= 0
    );
  }

  /**
   * Actualizar campo del formulario
   */
  updateField<K extends keyof ProductForm>(field: K, value: ProductForm[K]): void {
    this.formData.update(data => ({ ...data, [field]: value }));
  }

  /**
   * Agregar tag
   */
  addTag(): void {
    const tag = this.newTag().trim();
    if (tag && !this.formData().tags.includes(tag)) {
      this.formData.update(data => ({
        ...data,
        tags: [...data.tags, tag]
      }));
      this.newTag.set('');
    }
  }

  /**
   * Remover tag
   */
  removeTag(tag: string): void {
    this.formData.update(data => ({
      ...data,
      tags: data.tags.filter(t => t !== tag)
    }));
  }

  /**
   * Manejar selección de imagen principal O primera imagen
   */
  onMainImageSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || !input.files[0]) return;
    
    const file = input.files[0];
    
    // Validar tamaño (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      this.error.set('La imagen no debe superar 5MB');
      return;
    }

    // Validar tipo
    if (!file.type.startsWith('image/')) {
      this.error.set('Solo se permiten imágenes');
      return;
    }

    // Limpiar error previo
    this.error.set(null);

    // Preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      
      // Si NO hay imagen principal, esta será la principal
      if (!this.productImages().main) {
        this.productImages.update(images => ({
          ...images,
          main: imageUrl
        }));
        this.updateField('imageUrl', imageUrl);
      } else {
        // Si YA hay imagen principal, agregar a galería
        if (this.productImages().gallery.length < this.maxGalleryImages) {
          this.productImages.update(images => ({
            ...images,
            gallery: [...images.gallery, imageUrl]
          }));
        } else {
          this.error.set(`Máximo ${this.maxGalleryImages} imágenes en galería`);
        }
      }
    };
    reader.readAsDataURL(file);
    
    // Reset input
    input.value = '';
  }

  /**
   * Agregar imágenes SOLO a galería (botón +)
   */
  onGalleryImagesSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;
    
    const files = Array.from(input.files);
    let addedCount = 0;
    
    files.forEach(file => {
      // Validar que no exceda el máximo
      const currentCount = this.productImages().gallery.length;
      if (currentCount >= this.maxGalleryImages) {
        if (addedCount === 0) {
          this.error.set(`Máximo ${this.maxGalleryImages} imágenes en galería`);
        }
        return;
      }
      
      // Validar tamaño
      if (file.size > 5 * 1024 * 1024) {
        this.error.set('Las imágenes no deben superar 5MB');
        return;
      }

      // Validar tipo
      if (!file.type.startsWith('image/')) {
        this.error.set('Solo se permiten imágenes');
        return;
      }
      
      // Limpiar error
      this.error.set(null);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        
        // Si NO hay imagen principal, la primera va a main
        if (!this.productImages().main && addedCount === 0) {
          this.productImages.update(images => ({
            ...images,
            main: imageUrl
          }));
          this.updateField('imageUrl', imageUrl);
        } else {
          // Agregar SOLO a galería
          this.productImages.update(images => ({
            ...images,
            gallery: [...images.gallery, imageUrl]
          }));
        }
        
        addedCount++;
      };
      reader.readAsDataURL(file);
    });
    
    // Reset input para permitir subir la misma imagen de nuevo
    input.value = '';
  }

  /**
   * Click en miniatura → intercambiar con imagen principal
   */
  onThumbnailClick(index: number): void {
    const currentMain = this.productImages().main;
    const clickedImage = this.productImages().gallery[index];
    
    this.productImages.update(images => {
      const newGallery = [...images.gallery];
      
      if (currentMain) {
        // Intercambiar: main baja a galería, miniatura sube a main
        newGallery[index] = currentMain;
      } else {
        // Si no hay main, solo remover de galería
        newGallery.splice(index, 1);
      }
      
      return {
        main: clickedImage,
        gallery: newGallery
      };
    });
    
    // Actualizar formData
    this.updateField('imageUrl', clickedImage);
  }

  /**
   * Eliminar imagen de galería
   */
  removeGalleryImage(event: Event, index: number): void {
    event.stopPropagation(); // Evitar trigger del click en thumbnail
    
    this.productImages.update(images => ({
      ...images,
      gallery: images.gallery.filter((_, i) => i !== index)
    }));
  }

  /**
   * Eliminar imagen principal
   */
  removeMainImage(): void {
    const firstGalleryImage = this.productImages().gallery[0];
    
    this.productImages.update(images => ({
      main: firstGalleryImage || null,
      gallery: firstGalleryImage ? images.gallery.slice(1) : images.gallery
    }));
    
    // Actualizar formData
    this.updateField('imageUrl', firstGalleryImage || '');
  }

  /**
   * Obtener cantidad de slots vacíos
   */
  getEmptySlots(): number[] {
    const usedSlots = this.productImages().gallery.length;
    const emptyCount = Math.max(0, this.maxGalleryImages - usedSlots - 1); // -1 por el botón +
    return Array(emptyCount).fill(0).map((_, i) => i);
  }

  /**
   * Verificar si se pueden agregar más imágenes
   */
  canAddMoreImages(): boolean {
    return this.productImages().gallery.length < this.maxGalleryImages;
  }

  /**
   * Manejar selección de imagen (método anterior - mantener por compatibilidad)
   */
  onImageSelect(event: Event): void {
    this.onMainImageSelect(event);
  }

  /**
   * Enviar formulario
   */
  async onSubmit(): Promise<void> {
    if (!this.isFormValid()) {
      this.error.set('Por favor completa todos los campos obligatorios');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    // TODO: Llamar al servicio para crear el producto
    // Por ahora solo simulamos
    setTimeout(() => {
      this.loading.set(false);
      this.router.navigate(['/admin/inventory']);
    }, 1000);
  }

  /**
   * Cancelar y volver
   */
  onCancel(): void {
    if (confirm('¿Deseas descartar los cambios?')) {
      this.router.navigate(['/admin/inventory']);
    }
  }

  /**
   * Navegar a inventario
   */
  navigateToInventory(): void {
    if (confirm('¿Deseas descartar los cambios?')) {
      this.router.navigate(['/admin/inventory']);
    }
  }

  /**
   * Obtener nombre de categoría
   */
  getCategoryName(id: string): string {
    const category = this.categories().find(c => c.id === id);
    return category?.name || '';
  }
}
