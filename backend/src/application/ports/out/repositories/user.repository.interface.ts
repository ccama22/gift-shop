import { UserDomain } from '../../../../domain';
import { Email } from '../../../../domain/value-objects';

/**
 * Puerto de salida para persistencia de usuarios.
 * Define el contrato que debe implementar cualquier repositorio de usuarios.
 */
export interface IUserRepository {
  /**
   * Busca un usuario por su email.
   * @returns UserDomain si existe, null si no
   */
  findByEmail(email: Email): Promise<UserDomain | null>;

  /**
   * Busca un usuario por su ID.
   * @returns UserDomain si existe, null si no
   */
  findById(id: string): Promise<UserDomain | null>;

  /**
   * Guarda un nuevo usuario o actualiza uno existente.
   * @returns El usuario guardado con ID generado si es nuevo
   */
  save(user: UserDomain): Promise<UserDomain>;

  /**
   * Verifica si existe un usuario con el email dado.
   */
  existsByEmail(email: Email): Promise<boolean>;
}
