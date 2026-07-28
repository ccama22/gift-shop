import { RegisterUserDto } from '../../../dto/auth';
import { AuthResponseDto } from '../../../dto/auth';

/**
 * Puerto de entrada para el caso de uso de registro de usuario.
 * Define el contrato que debe implementar el caso de uso.
 */
export interface IRegisterUserUseCase {
  /**
   * Registra un nuevo usuario en el sistema.
   * @throws UserAlreadyExistsException si el email ya está registrado
   * @returns Tokens de autenticación
   */
  execute(dto: RegisterUserDto): Promise<AuthResponseDto>;
}
