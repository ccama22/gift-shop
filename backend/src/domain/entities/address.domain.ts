/**
 * Entidad de dominio AddressDomain.
 * Representa una dirección de entrega para regalos.
 */
export class AddressDomain {
  private constructor(
    private readonly id: string,
    private readonly userId: string,
    private recipientName: string,
    private recipientPhone: string,
    private streetAddress: string,
    private city: string,
    private reference: string | null,
    private readonly createdAt: Date,
  ) {}

  static create(params: {
    id: string;
    userId: string;
    recipientName: string;
    recipientPhone: string;
    streetAddress: string;
    city: string;
    reference?: string | null;
  }): AddressDomain {
    if (!params.recipientName || params.recipientName.trim().length === 0) {
      throw new Error('El nombre del destinatario es obligatorio');
    }
    if (!params.recipientPhone || params.recipientPhone.trim().length === 0) {
      throw new Error('El teléfono del destinatario es obligatorio');
    }
    if (!params.streetAddress || params.streetAddress.trim().length === 0) {
      throw new Error('La dirección de calle es obligatoria');
    }
    if (!params.city || params.city.trim().length === 0) {
      throw new Error('La ciudad de destino es obligatoria');
    }

    return new AddressDomain(
      params.id,
      params.userId,
      params.recipientName.trim(),
      params.recipientPhone.trim(),
      params.streetAddress.trim(),
      params.city.trim(),
      params.reference ?? null,
      new Date(),
    );
  }

  static fromPersistence(params: {
    id: string;
    userId: string;
    recipientName: string;
    recipientPhone: string;
    streetAddress: string;
    city: string;
    reference: string | null;
    createdAt: Date;
  }): AddressDomain {
    return new AddressDomain(
      params.id,
      params.userId,
      params.recipientName,
      params.recipientPhone,
      params.streetAddress,
      params.city,
      params.reference,
      params.createdAt,
    );
  }

  getId(): string {
    return this.id;
  }

  getUserId(): string {
    return this.userId;
  }

  getRecipientName(): string {
    return this.recipientName;
  }

  getRecipientPhone(): string {
    return this.recipientPhone;
  }

  getStreetAddress(): string {
    return this.streetAddress;
  }

  getCity(): string {
    return this.city;
  }

  getReference(): string | null {
    return this.reference;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }
}
