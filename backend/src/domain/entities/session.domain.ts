import { SessionExpiredException } from '../exceptions';

/**
 * Entidad de dominio Session (sin dependencias de infraestructura).
 * Representa una sesión de usuario con su ciclo de vida.
 */
export class SessionDomain {
  private constructor(
    private readonly id: string,
    private readonly userId: string,
    private refreshTokenHash: string | null,
    private active: boolean,
    private readonly expiresAt: Date,
    private revokedAt: Date | null,
    private readonly createdAt: Date,
    private updatedAt: Date,
  ) {}

  /**
   * Crea una nueva sesión activa.
   */
  static create(params: {
    id: string;
    userId: string;
    refreshTokenHash: string;
    expiresAt: Date;
  }): SessionDomain {
    const now = new Date();

    if (params.expiresAt <= now) {
      throw new Error('La fecha de expiración debe ser futura');
    }

    return new SessionDomain(
      params.id,
      params.userId,
      params.refreshTokenHash,
      true,
      params.expiresAt,
      null,
      now,
      now,
    );
  }

  /**
   * Reconstruye una sesión desde la base de datos.
   */
  static fromPersistence(params: {
    id: string;
    userId: string;
    refreshTokenHash: string | null;
    isActive: boolean;
    expiresAt: Date;
    revokedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }): SessionDomain {
    return new SessionDomain(
      params.id,
      params.userId,
      params.refreshTokenHash,
      params.isActive,
      params.expiresAt,
      params.revokedAt,
      params.createdAt,
      params.updatedAt,
    );
  }

  // Getters

  getId(): string {
    return this.id;
  }

  getUserId(): string {
    return this.userId;
  }

  getRefreshTokenHash(): string | null {
    return this.refreshTokenHash;
  }

  isActive(): boolean {
    return this.active;
  }

  getExpiresAt(): Date {
    return this.expiresAt;
  }

  getRevokedAt(): Date | null {
    return this.revokedAt;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  // Métodos de negocio

  /**
   * Verifica si la sesión ha expirado.
   * @throws SessionExpiredException si la sesión expiró
   */
  validateNotExpired(currentDate: Date = new Date()): void {
    if (currentDate > this.expiresAt) {
      throw new SessionExpiredException();
    }
  }

  /**
   * Verifica si la sesión es válida (activa y no expirada).
   */
  isValid(currentDate: Date = new Date()): boolean {
    return this.active && currentDate <= this.expiresAt && !this.revokedAt;
  }

  /**
   * Revoca la sesión (logout o seguridad).
   */
  revoke(): void {
    this.active = false;
    this.revokedAt = new Date();
    this.refreshTokenHash = null;
    this.updatedAt = new Date();
  }

  /**
   * Actualiza el hash del refresh token (durante refresh).
   */
  updateRefreshTokenHash(newHash: string): void {
    if (!this.active) {
      throw new Error('No se puede actualizar una sesión inactiva');
    }

    this.validateNotExpired();
    this.refreshTokenHash = newHash;
    this.updatedAt = new Date();
  }

  /**
   * Marca la sesión como expirada automáticamente.
   */
  markAsExpired(): void {
    this.active = false;
    this.revokedAt = new Date();
    this.updatedAt = new Date();
  }
}
