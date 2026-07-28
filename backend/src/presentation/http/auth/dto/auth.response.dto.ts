import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../../../domain/enums/user-role.enum';

export class UserResponseSummaryDto {
  @ApiProperty({ example: 'd214d7c5-3cf8-4ff9-90e0-0763205b7c5a' })
  id!: string;

  @ApiProperty({ example: 'user@example.com' })
  email!: string;

  @ApiProperty({ example: 'Juan Perez' })
  name!: string;

  @ApiProperty({ enum: UserRole, example: UserRole.CUSTOMER })
  role!: UserRole;
}

/**
 * DTO de salida HTTP para respuestas de autenticación.
 */
export class AuthResponseDto {
  @ApiProperty({ description: 'Access Token JWT para cabecera Authorization' })
  accessToken!: string;

  @ApiProperty({ description: 'Refresh Token JWT para renovación de sesión' })
  refreshToken!: string;

  @ApiProperty({ example: 'Bearer' })
  tokenType!: 'Bearer';

  @ApiProperty({
    example: 900,
    description: 'Segundos de validez del Access Token (15 min)',
  })
  expiresIn!: number;

  @ApiProperty({
    example: 604800,
    description: 'Segundos de validez del Refresh Token (7 días)',
  })
  refreshExpiresIn!: number;

  @ApiProperty({
    type: UserResponseSummaryDto,
    description: 'Resumen del perfil del usuario autenticado',
  })
  user!: UserResponseSummaryDto;
}
