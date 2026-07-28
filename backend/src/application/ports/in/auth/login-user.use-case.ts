import { LoginUserDto } from '../../../dto/auth';
import { AuthResponseDto } from '../../../dto/auth';

/**
 * Puerto de entrada para el caso de uso de login de usuario.
 * Define el contrato que debe implementar el caso de uso.
 */
export interface ILoginUserUseCase {
  /**
   * Autentica un usuario con sus credenciales.
   * @throws InvalidCredentialsException si las credenciales son inválidas
   * @returns Tokens de autenticación
   */
  execute(dto: LoginUserDto): Promise<AuthResponseDto>;
}
