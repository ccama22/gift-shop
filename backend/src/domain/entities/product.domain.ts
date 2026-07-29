import { ComboItemDomain } from './combo-item.domain';

/**
 * Entidad de dominio ProductDomain.
 * Representa un producto del catálogo (Ramos, Peluches, Chocolates o Combos).
 */
export class ProductDomain {
  private constructor(
    private readonly id: string,
    private readonly categoryId: string,
    private name: string,
    private description: string | null,
    private price: number,
    private stock: number,
    private isCombo: boolean,
    private imageUrl: string | null,
    private images: string[],
    private components: ComboItemDomain[],
    private isActive: boolean,
    private sku: string | null,
    private tags: string[],
    private lowStockAlert: number,
    private deletedAt: Date | null,
    private readonly createdAt: Date,
    private updatedAt: Date,
  ) {}

  static create(params: {
    id: string;
    categoryId: string;
    name: string;
    description?: string | null;
    price: number;
    stock: number;
    isCombo?: boolean;
    imageUrl?: string | null;
    images?: string[];
    components?: ComboItemDomain[];
    isActive?: boolean;
    sku?: string | null;
    tags?: string[];
    lowStockAlert?: number;
  }): ProductDomain {
    if (!params.name || params.name.trim().length === 0) {
      throw new Error('El nombre del producto no puede estar vacío');
    }
    if (params.price < 0) {
      throw new Error('El precio del producto no puede ser negativo');
    }
    if (params.stock < 0) {
      throw new Error('El stock no puede ser negativo');
    }

    const now = new Date();
    return new ProductDomain(
      params.id,
      params.categoryId,
      params.name.trim(),
      params.description ?? null,
      params.price,
      params.stock,
      params.isCombo ?? false,
      params.imageUrl ?? null,
      params.images ?? [],
      params.components ?? [],
      params.isActive ?? true,
      params.sku ?? null,
      params.tags ?? [],
      params.lowStockAlert ?? 10,
      null, // deletedAt siempre es null en creación
      now,
      now,
    );
  }

  static fromPersistence(params: {
    id: string;
    categoryId: string;
    name: string;
    description: string | null;
    price: number;
    stock: number;
    isCombo: boolean;
    imageUrl: string | null;
    images?: string[];
    components?: ComboItemDomain[];
    isActive: boolean;
    sku: string | null;
    tags: string[];
    lowStockAlert: number;
    deletedAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }): ProductDomain {
    return new ProductDomain(
      params.id,
      params.categoryId,
      params.name,
      params.description,
      params.price,
      params.stock,
      params.isCombo,
      params.imageUrl,
      params.images ?? [],
      params.components ?? [],
      params.isActive,
      params.sku,
      params.tags,
      params.lowStockAlert,
      params.deletedAt ?? null,
      params.createdAt,
      params.updatedAt,
    );
  }

  getId(): string {
    return this.id;
  }

  getCategoryId(): string {
    return this.categoryId;
  }

  getName(): string {
    return this.name;
  }

  getDescription(): string | null {
    return this.description;
  }

  getPrice(): number {
    return this.price;
  }

  getStock(): number {
    return this.stock;
  }

  getIsCombo(): boolean {
    return this.isCombo;
  }

  getIsActive(): boolean {
    return this.isActive;
  }

  getImageUrl(): string | null {
    return this.imageUrl;
  }

  getComponents(): ComboItemDomain[] {
    return this.components;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  getSku(): string | null {
    return this.sku;
  }

  getTags(): string[] {
    return this.tags;
  }

  getLowStockAlert(): number {
    return this.lowStockAlert;
  }

  getDeletedAt(): Date | null {
    return this.deletedAt;
  }

  isDeleted(): boolean {
    return this.deletedAt !== null;
  }

  isLowStock(): boolean {
    return this.stock <= this.lowStockAlert;
  }

  hasSufficientStock(requestedQuantity: number): boolean {
    return this.stock >= requestedQuantity;
  }

  decrementStock(quantity: number): void {
    if (quantity <= 0) {
      throw new Error('La cantidad a reducir debe ser mayor a 0');
    }
    if (this.stock < quantity) {
      throw new Error(`Stock insuficiente para el producto ${this.name}`);
    }
    this.stock -= quantity;
    this.updatedAt = new Date();
  }

  incrementStock(quantity: number): void {
    if (quantity <= 0) {
      throw new Error('La cantidad a incrementar debe ser mayor a 0');
    }
    this.stock += quantity;
    this.updatedAt = new Date();
  }

  updateDetails(params: {
    name?: string;
    description?: string | null;
    price?: number;
    stock?: number;
    imageUrl?: string | null;
    sku?: string | null;
    tags?: string[];
    lowStockAlert?: number;
  }): void {
    if (params.name !== undefined) {
      if (!params.name.trim())
        throw new Error('El nombre no puede estar vacío');
      this.name = params.name.trim();
    }
    if (params.description !== undefined) {
      this.description = params.description;
    }
    if (params.price !== undefined) {
      if (params.price < 0) throw new Error('El precio no puede ser negativo');
      this.price = params.price;
    }
    if (params.stock !== undefined) {
      if (params.stock < 0) throw new Error('El stock no puede ser negativo');
      this.stock = params.stock;
    }
    if (params.imageUrl !== undefined) {
      this.imageUrl = params.imageUrl;
    }
    if (params.sku !== undefined) {
      this.sku = params.sku;
    }
    if (params.tags !== undefined) {
      this.tags = params.tags;
    }
    if (params.lowStockAlert !== undefined) {
      if (params.lowStockAlert < 0) throw new Error('La alerta de stock no puede ser negativa');
      this.lowStockAlert = params.lowStockAlert;
    }
    this.updatedAt = new Date();
  }

  /**
   * Activa el producto (permite que sea visible/vendible cuando hay stock)
   */
  activate(): void {
    this.isActive = true;
    this.updatedAt = new Date();
  }

  /**
   * Desactiva el producto (oculto del catálogo sin importar el stock)
   */
  deactivate(): void {
    this.isActive = false;
    this.updatedAt = new Date();
  }

  /**
   * Determina si el producto puede venderse
   * Requiere: estar activo Y tener stock disponible Y NO estar eliminado
   */
  canBeSold(): boolean {
    return this.isActive && this.stock > 0 && !this.isDeleted();
  }

  /**
   * Marca el producto como eliminado (soft delete)
   * No elimina físicamente el registro, solo marca la fecha de eliminación
   */
  markAsDeleted(): void {
    if (this.isDeleted()) {
      throw new Error('El producto ya está eliminado');
    }
    this.deletedAt = new Date();
    this.updatedAt = new Date();
  }

  /**
   * Restaura un producto eliminado (undelete)
   */
  restore(): void {
    if (!this.isDeleted()) {
      throw new Error('El producto no está eliminado');
    }
    this.deletedAt = null;
    this.updatedAt = new Date();
  }
}
