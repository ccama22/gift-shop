/**
 * Configuración centralizada para cookies de autenticación
 * Principio: Single Responsibility - solo maneja configuración de cookies
 * Configuración desde variables de entorno (.env)
 */

export interface CookieConfig {
  name: string;
  maxAge: number;
  path: string;
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'strict' | 'lax' | 'none';
}

export class AuthCookieConfig {
  /**
   * Calcula maxAge en milisegundos desde segundos
   */
  private static toMilliseconds(seconds: number): number {
    return seconds * 1000;
  }

  static getAccessTokenConfig(
    isProduction: boolean,
    expiresInSeconds: number,
  ): CookieConfig {
    return {
      name: 'access_token',
      maxAge: this.toMilliseconds(expiresInSeconds),
      path: '/',
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
    };
  }

  static getRefreshTokenConfig(
    isProduction: boolean,
    expiresInSeconds: number,
  ): CookieConfig {
    return {
      name: 'refresh_token',
      maxAge: this.toMilliseconds(expiresInSeconds),
      path: '/auth/refresh',
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
    };
  }
}
