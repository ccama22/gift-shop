import { UserRole } from '../../../domain/enums/user-role.enum';

export interface UserResponseSummaryDto {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

/**
 * DTO de respuesta para operaciones de autenticación.
 */
export interface AuthResponseDto {
  accessToken: string;
  refreshToken: string;
  tokenType: 'Bearer';
  expiresIn: number; // Segundos
  refreshExpiresIn: number; // Segundos
  user: UserResponseSummaryDto;
}
