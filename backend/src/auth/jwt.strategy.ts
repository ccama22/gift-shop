import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { Session } from './entities/session.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => this.extractTokenFromCookie(req),
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('JWT_ACCESS_TOKEN_SECRET') ??
        configService.get<string>('JWT_SECRET') ??
        'dev-secret',
    });
  }

  private extractTokenFromCookie(req: Request): string | null {
    const cookieHeader = req.headers.cookie ?? '';
    const token = cookieHeader
      .split(';')
      .map((item) => item.trim())
      .find((item) => item.startsWith('access_token='))
      ?.replace('access_token=', '');

    return typeof token === 'string' && token.length > 0 ? token : null;
  }

  async validate(payload: { sub: string; email: string }) {
    const session = await this.sessionRepository.findOne({
      where: {
        userId: payload.sub,
        isActive: true,
      },
    });

    if (!session || session.revokedAt) {
      throw new UnauthorizedException('Sesión inválida o cerrada');
    }

    // Validar que la sesión no haya expirado
    if (session.expiresAt && new Date() > session.expiresAt) {
      session.isActive = false;
      session.revokedAt = new Date();
      await this.sessionRepository.save(session);
      throw new UnauthorizedException('Sesión expirada');
    }

    return {
      id: payload.sub,
      email: payload.email,
    };
  }
}
