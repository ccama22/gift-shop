/**
 * Entidad de dominio Category.
 * Representa una categoría de productos (ej. Ramos de Flores, Peluches, Chocolates, Combos).
 */
export class CategoryDomain {
  private constructor(
    private readonly id: string,
    private name: string,
    private slug: string,
    private description: string | null,
    private readonly createdAt: Date,
    private updatedAt: Date,
  ) {}

  static create(params: {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
  }): CategoryDomain {
    if (!params.name || params.name.trim().length === 0) {
      throw new Error('El nombre de la categoría es obligatorio');
    }
    if (!params.slug || params.slug.trim().length === 0) {
      throw new Error('El slug de la categoría es obligatorio');
    }

    const now = new Date();
    return new CategoryDomain(
      params.id,
      params.name.trim(),
      params.slug.trim().toLowerCase(),
      params.description ?? null,
      now,
      now,
    );
  }

  static fromPersistence(params: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): CategoryDomain {
    return new CategoryDomain(
      params.id,
      params.name,
      params.slug,
      params.description,
      params.createdAt,
      params.updatedAt,
    );
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getSlug(): string {
    return this.slug;
  }

  getDescription(): string | null {
    return this.description;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  updateDetails(name: string, description?: string | null): void {
    if (!name || name.trim().length === 0) {
      throw new Error('El nombre de la categoría es obligatorio');
    }
    this.name = name.trim();
    this.description = description ?? null;
    this.updatedAt = new Date();
  }
}
