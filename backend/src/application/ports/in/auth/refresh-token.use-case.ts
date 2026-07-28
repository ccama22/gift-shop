import { RefreshTokenDto } from '../../../dto/auth';
import { AuthResponseDto } from '../../../dto/auth';

/**
 * Puerto de entrada para el caso de uso de renovación de token.
 * Define el contrato que debe implementar el caso de uso.
 */
export interface IRefreshTokenUseCase {
  /**
   * Renueva los tokens de autenticación usando un refresh token válido.
   * @throws InvalidRefreshTokenException si el token es inválido
   * @throws SessionExpiredException si la sesión expiró
   * @returns Nuevos tokens de autenticación
   */
  execute(dto: RefreshTokenDto): Promise<AuthResponseDto>;
}
