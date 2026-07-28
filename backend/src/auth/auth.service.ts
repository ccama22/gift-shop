import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Response } from 'express';
import { User } from './entities/user.entity';
import { Session } from './entities/session.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { AuthTokenPayload } from './interfaces/auth-token-payload.interface';

// Tiempos de expiración
const ACCESS_TOKEN_EXPIRY = 15 * 60; // 15 minutos en segundos
const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60; // 7 días en segundos

@Injectable()
export class AuthService {
  private readonly jwtSecret: string;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.jwtSecret =
      this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET') ??
      this.configService.get<string>('JWT_SECRET') ??
      'dev-secret';
  }

  async validateUser(loginDto: LoginDto): Promise<User | null> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email: loginDto.email })
      .addSelect('user.passwordHash')
      .getOne();

    if (!user || !user.isActive) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  private createTokenPayload(user: User): AuthTokenPayload {
    return {
      sub: user.id,
      email: user.email,
    };
  }

  private async createActiveSession(userId: string): Promise<Session> {
    const session = this.sessionRepository.create({
      userId,
      isActive: true,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY * 1000), // Expira con el refresh token
    });

    return this.sessionRepository.save(session);
  }

  private async generateAccessToken(user: User): Promise<string> {
    const payload = this.createTokenPayload(user);
    return this.jwtService.signAsync(payload, {
      secret: this.jwtSecret,
      expiresIn: ACCESS_TOKEN_EXPIRY,
    });
  }

  private async generateRefreshToken(userId: string): Promise<string> {
    const payload = { sub: userId, type: 'refresh' };
    return this.jwtService.signAsync(payload, {
      secret: this.jwtSecret,
      expiresIn: REFRESH_TOKEN_EXPIRY,
    });
  }

  private async saveRefreshTokenHash(
    session: Session,
    refreshToken: string,
  ): Promise<void> {
    session.refreshTokenHash = await bcrypt.hash(refreshToken, 12);
    await this.sessionRepository.save(session);
  }

  private async validateSessionExpiry(session: Session): Promise<boolean> {
    if (!session.expiresAt) {
      return false;
    }

    const now = new Date();
    if (now > session.expiresAt) {
      session.isActive = false;
      session.revokedAt = now;
      await this.sessionRepository.save(session);
      return false;
    }

    return true;
  }

  async revokeSession(userId: string): Promise<void> {
    const session = await this.sessionRepository.findOne({
      where: { userId, isActive: true },
    });

    if (!session) {
      return;
    }

    session.isActive = false;
    session.revokedAt = new Date();
    session.refreshTokenHash = null; // Invalida el refresh token también
    await this.sessionRepository.save(session);
  }

  setAuthCookies(
    res: Response,
    accessToken: string,
    refreshToken: string,
  ): void {
    // Access token en cookie httpOnly (no accesible desde JavaScript)
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: ACCESS_TOKEN_EXPIRY * 1000,
      path: '/',
    });

    // Refresh token en cookie httpOnly separada
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: REFRESH_TOKEN_EXPIRY * 1000,
      path: '/auth/refresh', // Solo accesible en esta ruta
    });
  }

  clearAuthCookies(res: Response): void {
    res.clearCookie('access_token', { path: '/' });
    res.clearCookie('refresh_token', { path: '/auth/refresh' });
  }

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('El correo electrónico ya está registrado');
    }

    const passwordHash = await bcrypt.hash(registerDto.password, 12);

    const user = this.userRepository.create({
      name: registerDto.name,
      email: registerDto.email,
      passwordHash,
      isActive: true,
    });

    const savedUser = await this.userRepository.save(user);
    const session = await this.createActiveSession(savedUser.id);

    const accessToken = await this.generateAccessToken(savedUser);
    const refreshToken = await this.generateRefreshToken(savedUser.id);
    await this.saveRefreshTokenHash(session, refreshToken);

    return {
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
      expiresIn: ACCESS_TOKEN_EXPIRY,
      refreshExpiresIn: REFRESH_TOKEN_EXPIRY,
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.validateUser(loginDto);

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const session = await this.createActiveSession(user.id);

    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user.id);
    await this.saveRefreshTokenHash(session, refreshToken);

    return {
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
      expiresIn: ACCESS_TOKEN_EXPIRY,
      refreshExpiresIn: REFRESH_TOKEN_EXPIRY,
    };
  }

  async refresh(
    userId: string,
    refreshToken: string,
  ): Promise<AuthResponseDto> {
    // Buscar la sesión activa del usuario
    const session = await this.sessionRepository.findOne({
      where: { userId, isActive: true },
      relations: { user: true },
    });

    if (!session || !session.refreshTokenHash) {
      throw new UnauthorizedException('Sesión inválida');
    }

    // Validar que el refresh token no haya expirado
    const isValid = await this.validateSessionExpiry(session);
    if (!isValid) {
      throw new UnauthorizedException('Sesión expirada');
    }

    // Validar que el refresh token coincida con el guardado en BD
    const isRefreshTokenValid = await bcrypt.compare(
      refreshToken,
      session.refreshTokenHash,
    );

    if (!isRefreshTokenValid) {
      throw new UnauthorizedException('Refresh token inválido');
    }

    // Generar nuevos tokens
    const user = session.user;
    const accessToken = await this.generateAccessToken(user);
    const newRefreshToken = await this.generateRefreshToken(user.id);
    await this.saveRefreshTokenHash(session, newRefreshToken);

    return {
      accessToken,
      refreshToken: newRefreshToken,
      tokenType: 'Bearer',
      expiresIn: ACCESS_TOKEN_EXPIRY,
      refreshExpiresIn: REFRESH_TOKEN_EXPIRY,
    };
  }

  async verifyRefreshToken(
    token: string,
  ): Promise<{ sub: string; type: string }> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.jwtSecret,
      });
      return payload as { sub: string; type: string };
    } catch {
      throw new UnauthorizedException('Refresh token inválido o expirado');
    }
  }
}
