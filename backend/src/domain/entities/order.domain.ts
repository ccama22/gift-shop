import { OrderItemDomain } from './order-item.domain';

export type OrderStatus =
  'PENDING' | 'PREPARING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'PAID' | 'REFUNDED';

/**
 * Entidad de dominio OrderDomain.
 * Representa un pedido realizado en la tienda de regalos con dedicatoria y fecha de entrega.
 */
export class OrderDomain {
  private constructor(
    private readonly id: string,
    private readonly userId: string,
    private readonly addressId: string,
    private totalAmount: number,
    private cardMessage: string | null,
    private deliveryDate: Date,
    private status: OrderStatus,
    private paymentStatus: PaymentStatus,
    private items: OrderItemDomain[],
    private readonly createdAt: Date,
    private updatedAt: Date,
  ) {}

  static create(params: {
    id: string;
    userId: string;
    addressId: string;
    totalAmount: number;
    cardMessage?: string | null;
    deliveryDate: Date;
    items: OrderItemDomain[];
  }): OrderDomain {
    if (!params.items || params.items.length === 0) {
      throw new Error('El pedido debe incluir al menos un producto');
    }

    const now = new Date();
    return new OrderDomain(
      params.id,
      params.userId,
      params.addressId,
      params.totalAmount,
      params.cardMessage ?? null,
      params.deliveryDate,
      'PENDING',
      'PENDING',
      params.items,
      now,
      now,
    );
  }

  static fromPersistence(params: {
    id: string;
    userId: string;
    addressId: string;
    totalAmount: number;
    cardMessage: string | null;
    deliveryDate: Date;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    items: OrderItemDomain[];
    createdAt: Date;
    updatedAt: Date;
  }): OrderDomain {
    return new OrderDomain(
      params.id,
      params.userId,
      params.addressId,
      params.totalAmount,
      params.cardMessage,
      params.deliveryDate,
      params.status,
      params.paymentStatus,
      params.items,
      params.createdAt,
      params.updatedAt,
    );
  }

  getId(): string {
    return this.id;
  }

  getUserId(): string {
    return this.userId;
  }

  getAddressId(): string {
    return this.addressId;
  }

  getTotalAmount(): number {
    return this.totalAmount;
  }

  getCardMessage(): string | null {
    return this.cardMessage;
  }

  getDeliveryDate(): Date {
    return this.deliveryDate;
  }

  getStatus(): OrderStatus {
    return this.status;
  }

  getPaymentStatus(): PaymentStatus {
    return this.paymentStatus;
  }

  getItems(): OrderItemDomain[] {
    return this.items;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  updateStatus(newStatus: OrderStatus): void {
    this.status = newStatus;
    this.updatedAt = new Date();
  }

  markAsPaid(): void {
    this.paymentStatus = 'PAID';
    this.updatedAt = new Date();
  }
}
