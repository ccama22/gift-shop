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
    private components: ComboItemDomain[],
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
    components?: ComboItemDomain[];
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
      params.components ?? [],
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
    components?: ComboItemDomain[];
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
      params.components ?? [],
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
    this.updatedAt = new Date();
  }
}
