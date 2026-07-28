/**
 * Puerto de entrada para el caso de uso de logout de usuario.
 * Define el contrato que debe implementar el caso de uso.
 */
export interface ILogoutUserUseCase {
  /**
   * Cierra la sesión del usuario, revocando sus tokens.
   * @param userId ID del usuario que hace logout
   */
  execute(userId: string): Promise<void>;
}
