import { IsNotEmpty, IsString } from 'class-validator';

/**
 * DTO de entrada HTTP para refresh token.
 * Validaciones automáticas con class-validator.
 */
export class RefreshTokenRequestDto {
  @IsString()
  @IsNotEmpty()
  refreshToken!: string;
}
