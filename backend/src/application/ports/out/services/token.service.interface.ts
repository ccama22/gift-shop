import { Token } from '../../../../domain/value-objects';

/**
 * Payload decodificado de un access token.
 */
export interface AccessTokenPayload {
  sub: string; // User ID
  email: string;
}

/**
 * Payload decodificado de un refresh token.
 */
export interface RefreshTokenPayload {
  sub: string; // User ID
  type: 'refresh';
}

/**
 * Puerto de salida para generación y validación de tokens JWT.
 * Define el contrato que debe implementar cualquier servicio de tokens.
 */
export interface ITokenService {
  /**
   * Genera un access token con información del usuario.
   * @param userId ID del usuario
   * @param email Email del usuario
   * @param expiresIn Tiempo de expiración en segundos
   * @returns Token JWT como Value Object
   */
  generateAccessToken(
    userId: string,
    email: string,
    expiresIn: number,
  ): Promise<Token>;

  /**
   * Genera un refresh token.
   * @param userId ID del usuario
   * @param expiresIn Tiempo de expiración en segundos
   * @returns Token JWT como Value Object
   */
  generateRefreshToken(userId: string, expiresIn: number): Promise<Token>;

  /**
   * Verifica y decodifica un access token.
   * @throws Error si el token es inválido o expiró
   */
  verifyAccessToken(token: Token): Promise<AccessTokenPayload>;

  /**
   * Verifica y decodifica un refresh token.
   * @throws Error si el token es inválido o expiró
   */
  verifyRefreshToken(token: Token): Promise<RefreshTokenPayload>;
}
