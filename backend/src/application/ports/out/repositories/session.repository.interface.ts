import { SessionDomain } from '../../../../domain';

/**
 * Puerto de salida para persistencia de sesiones.
 * Define el contrato que debe implementar cualquier repositorio de sesiones.
 */
export interface ISessionRepository {
  /**
   * Busca la sesión activa de un usuario.
   * @returns SessionDomain si existe y está activa, null si no
   */
  findActiveByUserId(userId: string): Promise<SessionDomain | null>;

  /**
   * Busca una sesión por su ID.
   * @returns SessionDomain si existe, null si no
   */
  findById(id: string): Promise<SessionDomain | null>;

  /**
   * Guarda una nueva sesión o actualiza una existente.
   * @returns La sesión guardada con ID generado si es nueva
   */
  save(session: SessionDomain): Promise<SessionDomain>;

  /**
   * Elimina una sesión por su ID.
   */
  deleteById(id: string): Promise<void>;

  /**
   * Elimina todas las sesiones de un usuario.
   */
  deleteAllByUserId(userId: string): Promise<void>;
}
