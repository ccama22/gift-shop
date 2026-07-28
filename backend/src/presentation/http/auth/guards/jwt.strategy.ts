import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import type { ISessionRepository } from '../../../../application';
import * as DI_TOKENS from '../../../../application/ports/tokens';

/**
 * Payload del JWT decodificado.
 */
interface JwtPayload {
  sub: string;
  email: string;
}

/**
 * Usuario autenticado que se adjunta al request.
 */
export interface AuthenticatedUser {
  userId: string;
  email: string;
}

/**
 * Estrategia JWT para Passport.
 * Valida el access token y verifica que la sesión esté activa.
 *
 * Soporta dos formas de autenticación:
 * 1. Cookie 'access_token' (para navegadores web)
 * 2. Header 'Authorization: Bearer <token>' (para apps móviles/APIs)
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    @Inject(DI_TOKENS.ISessionRepository)
    private readonly sessionRepository: ISessionRepository,
  ) {
    super({
      // Extractor múltiple: soporta cookies Y headers
      jwtFromRequest: ExtractJwt.fromExtractors([
        // 1️⃣ Primero intenta extraer desde cookie (navegadores)
        JwtStrategy.extractJwtFromCookie,

        // 2️⃣ Si no hay cookie, intenta desde header Authorization (mobile/API)
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: JwtStrategy.getJwtSecret(configService),
    });
  }

  /**
   * Extrae el JWT desde la cookie 'access_token'.
   * Usado por navegadores web.
   */
  private static extractJwtFromCookie(req: Request): string | null {
    if (!req?.cookies || typeof req.cookies !== 'object') {
      return null;
    }

    const token = req.cookies['access_token'];
    return typeof token === 'string' && token.length > 0 ? token : null;
  }

  /**
   * Obtiene el JWT secret con validación estricta.
   * Principio: Fail Fast - Falla rápido si falta configuración crítica.
   *
   * @throws Error en producción si JWT_ACCESS_TOKEN_SECRET no está configurado
   * @returns JWT secret para firmar/verificar tokens
   */
  private static getJwtSecret(configService: ConfigService): string {
    const secret = configService.get<string>('JWT_ACCESS_TOKEN_SECRET');

    if (!secret) {
      const isProduction = configService.get('NODE_ENV') === 'production';

      if (isProduction) {
        throw new Error(
          'CRITICAL: JWT_ACCESS_TOKEN_SECRET is required in production. ' +
            'Set it in your .env file with a secure random string.',
        );
      }

      console.warn(
        '⚠️  WARNING: Using default JWT secret for DEVELOPMENT ONLY. ' +
          'Set JWT_ACCESS_TOKEN_SECRET in .env for production.',
      );
      return 'dev-secret-only-for-development-CHANGE-IN-PRODUCTION';
    }

    return secret;
  }

  /**
   * Valida el payload del JWT y verifica la sesión.
   * Este método se llama automáticamente después de que Passport decodifica el JWT.
   */
  async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    // 1. Verificar que la sesión del usuario esté activa
    const session = await this.sessionRepository.findActiveByUserId(
      payload.sub,
    );

    if (!session) {
      throw new UnauthorizedException('Sesión inválida o expirada');
    }

    // 2. Validar que la sesión no haya expirado
    try {
      session.validateNotExpired();
    } catch {
      // Marcar sesión como expirada
      session.markAsExpired();
      await this.sessionRepository.save(session);
      throw new UnauthorizedException('Sesión expirada');
    }

    // 3. Retornar el usuario autenticado (se adjunta a req.user)
    return {
      userId: payload.sub,
      email: payload.email,
    };
  }
}
