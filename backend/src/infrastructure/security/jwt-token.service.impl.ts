import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  ITokenService,
  AccessTokenPayload,
  RefreshTokenPayload,
} from '../../application';
import { Token } from '../../domain/value-objects';

/**
 * Implementación de ITokenService usando @nestjs/jwt.
 * Capa de infraestructura - depende de NestJS y JWT.
 */
@Injectable()
export class JwtTokenServiceImpl implements ITokenService {
  private readonly jwtSecret: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    // Validación estricta: falla en producción si falta JWT_ACCESS_TOKEN_SECRET
    // En desarrollo, usa fallback solo como último recurso
    this.jwtSecret = this.getJwtSecret();
  }

  /**
   * Obtiene el JWT secret con validación de entorno.
   * Principio: Fail Fast - Falla rápido en producción si falta configuración crítica.
   *
   * @throws Error en producción si JWT_ACCESS_TOKEN_SECRET no está configurado
   * @returns JWT secret para firmar/verificar tokens
   */
  private getJwtSecret(): string {
    const secret = this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET');

    if (!secret) {
      const isProduction = this.configService.get('NODE_ENV') === 'production';

      if (isProduction) {
        throw new Error(
          'CRITICAL: JWT_ACCESS_TOKEN_SECRET is required in production. ' +
            "Generate a secure secret with: node -e \"console.log(require('crypto').randomBytes(64).toString('hex'))\"",
        );
      }

      // Solo en desarrollo, permitir fallback
      console.warn(
        '⚠️  WARNING: Using default JWT secret for DEVELOPMENT ONLY. ' +
          'Set JWT_ACCESS_TOKEN_SECRET in .env for production.',
      );
      return 'dev-secret-only-for-development-CHANGE-IN-PRODUCTION';
    }

    return secret;
  }

  async generateAccessToken(
    userId: string,
    email: string,
    expiresIn: number,
  ): Promise<Token> {
    const payload: AccessTokenPayload = {
      sub: userId,
      email,
    };

    const token = await this.jwtService.signAsync(payload, {
      secret: this.jwtSecret,
      expiresIn,
    });

    return Token.create(token);
  }

  async generateRefreshToken(
    userId: string,
    expiresIn: number,
  ): Promise<Token> {
    const payload: RefreshTokenPayload = {
      sub: userId,
      type: 'refresh',
    };

    const token = await this.jwtService.signAsync(payload, {
      secret: this.jwtSecret,
      expiresIn,
    });

    return Token.create(token);
  }

  async verifyAccessToken(token: Token): Promise<AccessTokenPayload> {
    try {
      const payload = await this.jwtService.verifyAsync(token.getValue(), {
        secret: this.jwtSecret,
      });

      return payload as AccessTokenPayload;
    } catch (error) {
      throw new UnauthorizedException('Access token inválido o expirado');
    }
  }

  async verifyRefreshToken(token: Token): Promise<RefreshTokenPayload> {
    try {
      const payload = await this.jwtService.verifyAsync(token.getValue(), {
        secret: this.jwtSecret,
      });

      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Token no es un refresh token');
      }

      return payload as RefreshTokenPayload;
    } catch (error) {
      throw new UnauthorizedException('Refresh token inválido o expirado');
    }
  }
}
