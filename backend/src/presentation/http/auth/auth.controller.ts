import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
  UseGuards,
  Request,
  Inject,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import type { Response } from 'express';
import type {
  IRegisterUserUseCase,
  ILoginUserUseCase,
  IRefreshTokenUseCase,
  ILogoutUserUseCase,
  ITokenService,
} from '../../../application';
import * as DI_TOKENS from '../../../application/ports/tokens';
import { Token } from '../../../domain/value-objects';
import {
  RegisterRequestDto,
  LoginRequestDto,
  RefreshTokenRequestDto,
  AuthResponseDto,
} from './dto';
import { JwtAuthGuard, AuthenticatedUser } from './guards';
import { CookieService } from './services';
import { ExceptionMapper } from './mappers';

/**
 * Controlador de autenticación (REST API).
 */
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(DI_TOKENS.IRegisterUserUseCase)
    private readonly registerUserUseCase: IRegisterUserUseCase,
    @Inject(DI_TOKENS.ILoginUserUseCase)
    private readonly loginUserUseCase: ILoginUserUseCase,
    @Inject(DI_TOKENS.IRefreshTokenUseCase)
    private readonly refreshTokenUseCase: IRefreshTokenUseCase,
    @Inject(DI_TOKENS.ILogoutUserUseCase)
    private readonly logoutUserUseCase: ILogoutUserUseCase,
    @Inject(DI_TOKENS.ITokenService)
    private readonly tokenService: ITokenService,
    private readonly cookieService: CookieService,
  ) {}

  /**
   * POST /auth/register
   * Registra un nuevo usuario.
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registrar un nuevo cliente' })
  @ApiResponse({
    status: 201,
    description: 'Usuario registrado exitosamente',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 409, description: 'El correo electrónico ya existe' })
  async register(
    @Body() dto: RegisterRequestDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    try {
      const result = await this.registerUserUseCase.execute({
        name: dto.name,
        email: dto.email,
        password: dto.password,
      });

      this.cookieService.setAuthCookies(
        res,
        result.accessToken,
        result.refreshToken,
      );

      return result;
    } catch (error) {
      ExceptionMapper.mapToHttpException(error as Error);
    }
  }

  /**
   * POST /auth/login
   * Autentica un usuario existente.
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Iniciar sesión (obtener tokens y perfil)' })
  @ApiResponse({
    status: 200,
    description: 'Login exitoso',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  async login(
    @Body() dto: LoginRequestDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    try {
      const result = await this.loginUserUseCase.execute({
        email: dto.email,
        password: dto.password,
      });

      this.cookieService.setAuthCookies(
        res,
        result.accessToken,
        result.refreshToken,
      );

      return result;
    } catch (error) {
      ExceptionMapper.mapToHttpException(error as Error);
    }
  }

  /**
   * POST /auth/refresh
   * Renueva los tokens usando un refresh token válido.
   */
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Renovar Access Token expirado' })
  @ApiResponse({
    status: 200,
    description: 'Tokens renovados exitosamente',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Refresh Token inválido o expirado',
  })
  async refresh(
    @Body() dto: RefreshTokenRequestDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    try {
      const refreshTokenVO = Token.create(dto.refreshToken);
      const payload =
        await this.tokenService.verifyRefreshToken(refreshTokenVO);

      const result = await this.refreshTokenUseCase.execute({
        userId: payload.sub,
        refreshToken: dto.refreshToken,
      });

      this.cookieService.setAuthCookies(
        res,
        result.accessToken,
        result.refreshToken,
      );

      return result;
    } catch (error) {
      ExceptionMapper.mapToHttpException(error as Error);
    }
  }

  /**
   * POST /auth/logout
   * Cierra la sesión del usuario actual.
   */
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Cerrar sesión e invalidar Refresh Token' })
  @ApiResponse({ status: 24, description: 'Sesión cerrada correctamente' })
  async logout(
    @Request() req: { user: AuthenticatedUser },
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    await this.logoutUserUseCase.execute(req.user.userId);
    this.cookieService.clearAuthCookies(res);
  }

  /**
   * POST /auth/me
   * Obtiene información del usuario actual.
   */
  @Post('me')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
  async getProfile(@Request() req: { user: AuthenticatedUser }) {
    return {
      userId: req.user.userId,
      email: req.user.email,
    };
  }
}
