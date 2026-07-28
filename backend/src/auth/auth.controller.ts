import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    const authResponse = await this.authService.register(registerDto);

    this.authService.setAuthCookies(
      res,
      authResponse.accessToken,
      authResponse.refreshToken,
    );

    return authResponse;
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    const authResponse = await this.authService.login(loginDto);

    this.authService.setAuthCookies(
      res,
      authResponse.accessToken,
      authResponse.refreshToken,
    );

    return authResponse;
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async refresh(
    @Body() refreshTokenDto: RefreshTokenDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    // Validar el refresh token JWT para obtener el userId
    const payload = await this.authService.verifyRefreshToken(
      refreshTokenDto.refreshToken,
    );

    const authResponse = await this.authService.refresh(
      payload.sub,
      refreshTokenDto.refreshToken,
    );

    this.authService.setAuthCookies(
      res,
      authResponse.accessToken,
      authResponse.refreshToken,
    );

    return authResponse;
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const user = req.user as { id?: string } | undefined;

    if (user?.id) {
      await this.authService.revokeSession(user.id);
    }

    this.authService.clearAuthCookies(res);
    return { message: 'Sesión cerrada correctamente' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req: Request) {
    return req.user;
  }
}
