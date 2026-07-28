/**
 * Entidad de dominio ComboItemDomain.
 * Representa la relación entre un Producto Combo y uno de sus componentes con su cantidad.
 */
export class ComboItemDomain {
  private constructor(
    private readonly comboId: string,
    private readonly productId: string,
    private quantity: number,
    private productName?: string,
    private productPrice?: number,
  ) {}

  static create(params: {
    comboId: string;
    productId: string;
    quantity: number;
    productName?: string;
    productPrice?: number;
  }): ComboItemDomain {
    if (params.quantity <= 0) {
      throw new Error(
        'La cantidad de un componente en el combo debe ser mayor a 0',
      );
    }

    return new ComboItemDomain(
      params.comboId,
      params.productId,
      params.quantity,
      params.productName,
      params.productPrice,
    );
  }

  static fromPersistence(params: {
    comboId: string;
    productId: string;
    quantity: number;
    productName?: string;
    productPrice?: number;
  }): ComboItemDomain {
    return new ComboItemDomain(
      params.comboId,
      params.productId,
      params.quantity,
      params.productName,
      params.productPrice,
    );
  }

  getComboId(): string {
    return this.comboId;
  }

  getProductId(): string {
    return this.productId;
  }

  getQuantity(): number {
    return this.quantity;
  }

  getProductName(): string | undefined {
    return this.productName;
  }

  getProductPrice(): number | undefined {
    return this.productPrice;
  }
}
