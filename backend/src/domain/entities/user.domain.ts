import { Email } from '../value-objects/email.vo';
import { Password } from '../value-objects/password.vo';
import { UserRole } from '../enums/user-role.enum';

/**
 * Entidad de dominio User (sin dependencias de infraestructura).
 * Representa un usuario en el sistema con sus reglas de negocio.
 */
export class UserDomain {
  private constructor(
    private readonly id: string,
    private readonly email: Email,
    private name: string,
    private password: Password,
    private role: UserRole,
    private active: boolean,
    private readonly createdAt: Date,
    private updatedAt: Date,
  ) {}

  /**
   * Crea un nuevo usuario (para registro por defecto como CUSTOMER).
   */
  static create(params: {
    id: string;
    email: Email;
    name: string;
    password: Password;
    role?: UserRole;
  }): UserDomain {
    const now = new Date();

    if (!params.name || params.name.trim().length === 0) {
      throw new Error('El nombre no puede estar vacío');
    }

    if (params.name.trim().length > 200) {
      throw new Error('El nombre no puede exceder 200 caracteres');
    }

    return new UserDomain(
      params.id,
      params.email,
      params.name.trim(),
      params.password,
      params.role ?? UserRole.CUSTOMER,
      true,
      now,
      now,
    );
  }

  /**
   * Reconstruye un usuario desde la base de datos.
   */
  static fromPersistence(params: {
    id: string;
    email: Email;
    name: string;
    password: Password;
    role: UserRole;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): UserDomain {
    return new UserDomain(
      params.id,
      params.email,
      params.name,
      params.password,
      params.role,
      params.isActive,
      params.createdAt,
      params.updatedAt,
    );
  }

  // Getters

  getId(): string {
    return this.id;
  }

  getEmail(): Email {
    return this.email;
  }

  getName(): string {
    return this.name;
  }

  getPassword(): Password {
    return this.password;
  }

  getRole(): UserRole {
    return this.role;
  }

  isActive(): boolean {
    return this.active;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  // Helpers de negocio

  isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }

  isFlorist(): boolean {
    return this.role === UserRole.FLORIST;
  }

  isDeliveryDriver(): boolean {
    return this.role === UserRole.DELIVERY_DRIVER;
  }

  isCustomer(): boolean {
    return this.role === UserRole.CUSTOMER;
  }

  // Métodos de negocio

  deactivate(): void {
    this.active = false;
    this.updatedAt = new Date();
  }

  activate(): void {
    this.active = true;
    this.updatedAt = new Date();
  }

  updateRole(newRole: UserRole): void {
    this.role = newRole;
    this.updatedAt = new Date();
  }

  updateName(newName: string): void {
    if (!newName || newName.trim().length === 0) {
      throw new Error('El nombre no puede estar vacío');
    }

    if (newName.trim().length > 200) {
      throw new Error('El nombre no puede exceder 200 caracteres');
    }

    this.name = newName.trim();
    this.updatedAt = new Date();
  }

  changePassword(newPassword: Password): void {
    this.password = newPassword;
    this.updatedAt = new Date();
  }
}
