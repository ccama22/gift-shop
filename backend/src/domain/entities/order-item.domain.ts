/**
 * Entidad de dominio OrderItemDomain.
 * Representa un ítem individual dentro de un pedido con su precio unitario congelado.
 */
export class OrderItemDomain {
  private constructor(
    private readonly id: string,
    private readonly orderId: string,
    private readonly productId: string,
    private readonly quantity: number,
    private readonly unitPrice: number,
    private readonly productName?: string,
  ) {}

  static create(params: {
    id: string;
    orderId: string;
    productId: string;
    quantity: number;
    unitPrice: number;
    productName?: string;
  }): OrderItemDomain {
    if (params.quantity <= 0) {
      throw new Error('La cantidad comprada debe ser mayor a 0');
    }
    if (params.unitPrice < 0) {
      throw new Error('El precio unitario no puede ser negativo');
    }

    return new OrderItemDomain(
      params.id,
      params.orderId,
      params.productId,
      params.quantity,
      params.unitPrice,
      params.productName,
    );
  }

  static fromPersistence(params: {
    id: string;
    orderId: string;
    productId: string;
    quantity: number;
    unitPrice: number;
    productName?: string;
  }): OrderItemDomain {
    return new OrderItemDomain(
      params.id,
      params.orderId,
      params.productId,
      params.quantity,
      params.unitPrice,
      params.productName,
    );
  }

  getId(): string {
    return this.id;
  }

  getOrderId(): string {
    return this.orderId;
  }

  getProductId(): string {
    return this.productId;
  }

  getQuantity(): number {
    return this.quantity;
  }

  getUnitPrice(): number {
    return this.unitPrice;
  }

  getProductName(): string | undefined {
    return this.productName;
  }

  getSubtotal(): number {
    return this.quantity * this.unitPrice;
  }
}
