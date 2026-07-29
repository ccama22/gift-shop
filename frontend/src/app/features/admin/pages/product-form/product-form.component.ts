import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ProductService } from '@core/services/product.service';
import { Category, CreateProductRequest, UpdateProductRequest } from '@core/models/product.model';

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
  isActive: boolean;
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
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);

  // ============================================
  // SIGNALS
  // ============================================
  readonly categories = this.productService.categories;
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  readonly newTag = signal<string>('');
  
  // Modo de operación: 'create' o 'edit'
  readonly mode = signal<'create' | 'edit'>('create');
  readonly productId = signal<string | null>(null);
  
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

  // Rastrear imágenes originales de la BD (para detectar eliminaciones)
  private originalImages = signal<Array<{ id: string; imageUrl: string; isPrimary: boolean }>>([]);
  
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
    tags: [],
    isActive: true
  });

  // ============================================
  // LIFECYCLE
  // ============================================
  ngOnInit(): void {
    this.productService.loadCategories().subscribe();
    
    // Detectar modo según la ruta
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      // Modo EDICIÓN
      this.mode.set('edit');
      this.productId.set(id);
      this.loadProductData(id);
    } else {
      // Modo CREACIÓN
      this.mode.set('create');
      this.generateSKU();
    }
  }

  // ============================================
  // MÉTODOS
  // ============================================

  /**
   * Cargar datos del producto para edición
   */
  private async loadProductData(id: string): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    
    try {
      const product = await firstValueFrom(
        this.productService.getProductById(id)
      );
      
      if (!product) {
        this.error.set('Producto no encontrado');
        setTimeout(() => this.router.navigate(['/admin/inventory']), 2000);
        return;
      }
      
      // Generar SKU basado en el producto (solo para visualización)
      const productCode = this.generateProductCode(product.name, product.id);
      
      // Llenar el formulario con los datos del producto
      this.formData.set({
        name: product.name,
        description: product.description || '',
        price: product.price,
        stock: product.stock,
        categoryId: product.categoryId,
        imageUrl: product.imageUrl || '',
        isCombo: product.isCombo,
        lowStockAlert: product.lowStockAlert || 10,
        sku: product.sku || this.generateProductCode(product.name, product.id),
        tags: Array.isArray(product.tags) ? product.tags : [],
        isActive: product.isActive
      });
      
      // Cargar imagen si existe
      if (product.imageUrl) {
        let fullImageUrl = product.imageUrl;
        
        // Si la URL es relativa, construir URL completa
        if (!product.imageUrl.startsWith('http://') && 
            !product.imageUrl.startsWith('https://') &&
            !product.imageUrl.startsWith('data:')) {
          fullImageUrl = `${this.productService.SERVER_URL}${product.imageUrl}`;
        }
        
        
        // Actualizar galería con la imagen principal
        this.productImages.update(images => ({
          main: fullImageUrl,
          gallery: [] // Se llenará con product.images
        }));
        
        // También actualizar en formData
        this.updateField('imageUrl', product.imageUrl); // Guardar el path relativo original
      }

      // Cargar galería de imágenes adicionales
      if (product.images && product.images.length > 0) {
        // Guardar las imágenes originales para detectar eliminaciones
        this.originalImages.set([...product.images]);

        const galleryImages = product.images
          .filter(img => !img.isPrimary)
          .sort((a, b) => a.displayOrder - b.displayOrder)
          .map(img => {
            const url = img.imageUrl;
            if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
              return url;
            }
            return `${this.productService.SERVER_URL}${url}`;
          });

        // Encontrar imagen principal
        const primaryImage = product.images.find(img => img.isPrimary);
        if (primaryImage) {
          const primaryUrl = primaryImage.imageUrl.startsWith('http://') || 
                           primaryImage.imageUrl.startsWith('https://') ||
                           primaryImage.imageUrl.startsWith('data:')
            ? primaryImage.imageUrl
            : `${this.productService.SERVER_URL}${primaryImage.imageUrl}`;
          
          this.productImages.update(images => ({
            main: primaryUrl,
            gallery: galleryImages
          }));
        } else {
          this.productImages.update(images => ({
            ...images,
            gallery: galleryImages
          }));
        }

      } else {
        // No hay imágenes adicionales
        this.originalImages.set([]);
      }
      
    } catch (err: any) {
      console.error('❌ Error cargando producto:', err);
      this.error.set('Error al cargar el producto');
    } finally {
      this.loading.set(false);
    }
  }
  
  /**
   * Generar código de producto para visualización
   */
  private generateProductCode(name: string, id: string): string {
    const prefix = name.substring(0, 3).toUpperCase();
    const suffix = id.substring(id.length - 6).toUpperCase();
    return `${prefix}-${suffix}`;
  }

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
      data.stock >= 0 &&
      this.productImages().main !== null  // ← Requiere al menos 1 imagen
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
    if (tag) {
      const currentTags = this.formData().tags || [];
      if (!currentTags.includes(tag)) {
        this.formData.update(data => ({
          ...data,
          tags: [...currentTags, tag]
        }));
      }
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
    
    // Actualizar formData (puede quedar vacío si no hay más imágenes)
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
    // 0. Si el usuario escribió un tag pero no presionó Enter, agregarlo
    if (this.newTag().trim()) {
      this.addTag();
    }

    // Validación específica de imagen
    if (!this.productImages().main) {
      this.error.set('⚠️ Debes agregar al menos una imagen para el producto');
      // Scroll hacia arriba para que vea el error
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!this.isFormValid()) {
      this.error.set('Completa todos los campos obligatorios');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    try {
      let imageUrl = this.formData().imageUrl || '';
      const imagesToUpload: Array<{ url: string; isPrimary: boolean }> = [];

      const mainImg = this.productImages().main;

      // 1. Subir imagen principal si es nueva (base64)
      if (mainImg && mainImg.startsWith('data:')) {
        const file = await this.base64ToFile(
          mainImg,
          'product-main.jpg'
        );
        const uploadRes = await firstValueFrom(
          this.productService.uploadImage(file)
        );
        imageUrl = uploadRes.url;
        // NO agregamos a imagesToUpload porque ya está en imageUrl
      } else if (mainImg) {
        // Si la imagen ya existe y es una URL completa, extraer solo el path relativo
        if (mainImg.includes(this.productService.SERVER_URL)) {
          imageUrl = mainImg.replace(this.productService.SERVER_URL, '');
        } else {
          imageUrl = mainImg;
        }
      }

      // 2. Subir SOLO imágenes de galería que sean nuevas (base64)
      for (let i = 0; i < this.productImages().gallery.length; i++) {
        const galleryImage = this.productImages().gallery[i];
        
        if (galleryImage.startsWith('data:')) {
          const file = await this.base64ToFile(
            galleryImage,
            `product-gallery-${i}.jpg`
          );
          const uploadRes = await firstValueFrom(
            this.productService.uploadImage(file)
          );
          imagesToUpload.push({ url: uploadRes.url, isPrimary: false });
        }
      }

      if (this.mode() === 'edit' && this.productId()) {
        // MODO EDICIÓN
        const productData: UpdateProductRequest = {
          name: this.formData().name,
          description: this.formData().description || undefined,
          price: this.formData().price!,
          stock: this.formData().stock!,
          categoryId: this.formData().categoryId,
          isActive: this.formData().isActive,
          isCombo: this.formData().isCombo,
          imageUrl: imageUrl || undefined,
          lowStockAlert: this.formData().lowStockAlert,
          tags: this.formData().tags.length > 0 ? this.formData().tags : undefined
        };

        await firstValueFrom(
          this.productService.updateProduct(this.productId()!, productData)
        );

        // Detectar imágenes eliminadas
        const currentGalleryUrls = this.productImages().gallery;
        const currentMainUrl = this.productImages().main;
        
        const imagesToDelete = this.originalImages()
          .filter(originalImg => {
            // Construir URL completa para comparar
            const fullUrl = originalImg.imageUrl.startsWith('http://') || 
                          originalImg.imageUrl.startsWith('https://') ||
                          originalImg.imageUrl.startsWith('data:')
              ? originalImg.imageUrl
              : `${this.productService.SERVER_URL}${originalImg.imageUrl}`;
            
            // Si es la imagen principal (isPrimary: true)
            if (originalImg.isPrimary) {
              // Si la main actual es diferente o null, eliminar la original
              return currentMainUrl !== fullUrl;
            }
            
            // Si es imagen de galería, verificar si aún está en la galería actual
            return !currentGalleryUrls.includes(fullUrl);
          });

        // Eliminar imágenes
        for (const img of imagesToDelete) {
          await firstValueFrom(
            this.productService.deleteProductImage(this.productId()!, img.id)
          );
        }

        // Agregar SOLO nuevas imágenes de galería si hay
        if (imagesToUpload.length > 0) {
          await firstValueFrom(
            this.productService.addProductImages(this.productId()!, imagesToUpload)
          );
        }
      } else {
        // MODO CREACIÓN
        const productData: CreateProductRequest = {
          name: this.formData().name,
          description: this.formData().description || undefined,
          price: this.formData().price!,
          stock: this.formData().stock!,
          categoryId: this.formData().categoryId,
          isActive: this.formData().isActive,
          isCombo: this.formData().isCombo,
          imageUrl: imageUrl || undefined,
          lowStockAlert: this.formData().lowStockAlert,
          sku: this.formData().sku,
          tags: this.formData().tags.length > 0 ? this.formData().tags : undefined
        };

        const createdProduct = await firstValueFrom(
          this.productService.createProduct(productData)
        );

        // Agregar SOLO imágenes de galería (la principal ya está en imageUrl)
        if (imagesToUpload.length > 0) {
          await firstValueFrom(
            this.productService.addProductImages(createdProduct.id, imagesToUpload)
          );
        }
      }

      // 3. Navegar
      this.router.navigate(['/admin/inventory']);
    } catch (err: any) {
      console.error('Error guardando producto:', err);
      this.error.set(err.error?.message || err.message || 'Error al guardar producto');
    } finally {
      this.loading.set(false);
    }
  }

  // Método helper para convertir base64 a File
  private async base64ToFile(base64: string, filename: string): Promise<File> {
    const res = await fetch(base64);
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type });
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
