import { Password } from '../../../../domain/value-objects';

/**
 * Puerto de salida para hasheo y comparación de contraseñas.
 * Define el contrato que debe implementar cualquier servicio de hashing.
 */
export interface IPasswordHasher {
  /**
   * Hashea una contraseña en texto plano.
   * @param password Contraseña en texto plano
   * @returns Password con el hash generado
   */
  hash(password: Password): Promise<Password>;

  /**
   * Compara una contraseña en texto plano con un hash.
   * @param plainPassword Contraseña en texto plano
   * @param hashedPassword Password con el hash guardado
   * @returns true si coinciden, false si no
   */
  compare(plainPassword: Password, hashedPassword: Password): Promise<boolean>;
}
