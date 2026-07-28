/**
 * Servicio para manejo de cookies de autenticación
 * Principio: Single Responsibility - solo maneja operaciones de cookies
 * Principio: Open/Closed - extensible sin modificar el código existente
 * Configuración desde variables de entorno
 */

import type { Response } from 'express';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthCookieConfig, CookieConfig } from '../config/auth-cookie.config';

@Injectable()
export class CookieService {
  private readonly isProduction: boolean;
  private readonly accessTokenExpiresIn: number;
  private readonly refreshTokenExpiresIn: number;

  constructor(private readonly configService: ConfigService) {
    this.isProduction = this.configService.get('NODE_ENV') === 'production';

    // Leer desde .env con valores por defecto
    this.accessTokenExpiresIn = parseInt(
      this.configService.get('JWT_ACCESS_TOKEN_EXPIRES_IN', '900'), // 15 minutos por defecto
      10,
    );

    this.refreshTokenExpiresIn = parseInt(
      this.configService.get('JWT_REFRESH_TOKEN_EXPIRES_IN', '604800'), // 7 días por defecto
      10,
    );
  }

  /**
   * Configura las cookies de autenticación (access y refresh tokens)
   */
  setAuthCookies(
    res: Response,
    accessToken: string,
    refreshToken: string,
  ): void {
    const accessConfig = AuthCookieConfig.getAccessTokenConfig(
      this.isProduction,
      this.accessTokenExpiresIn,
    );
    const refreshConfig = AuthCookieConfig.getRefreshTokenConfig(
      this.isProduction,
      this.refreshTokenExpiresIn,
    );

    this.setCookie(res, accessConfig, accessToken);
    this.setCookie(res, refreshConfig, refreshToken);
  }

  /**
   * Limpia las cookies de autenticación
   */
  clearAuthCookies(res: Response): void {
    const accessConfig = AuthCookieConfig.getAccessTokenConfig(
      this.isProduction,
      this.accessTokenExpiresIn,
    );
    const refreshConfig = AuthCookieConfig.getRefreshTokenConfig(
      this.isProduction,
      this.refreshTokenExpiresIn,
    );

    res.clearCookie(accessConfig.name, { path: accessConfig.path });
    res.clearCookie(refreshConfig.name, { path: refreshConfig.path });
  }

  /**
   * Método privado para configurar una cookie individual
   */
  private setCookie(res: Response, config: CookieConfig, value: string): void {
    res.cookie(config.name, value, {
      httpOnly: config.httpOnly,
      secure: config.secure,
      sameSite: config.sameSite,
      maxAge: config.maxAge,
      path: config.path,
    });
  }
}
