import { ILogoutUserUseCase } from '../../ports/in/auth';
import { ISessionRepository } from '../../ports/out/repositories';

/**
 * Implementación del caso de uso de logout de usuario.
 * Revoca la sesión activa del usuario.
 */
export class LogoutUserUseCaseImpl implements ILogoutUserUseCase {
  constructor(private readonly sessionRepository: ISessionRepository) {}

  async execute(userId: string): Promise<void> {
    // 1. Buscar la sesión activa del usuario
    const session = await this.sessionRepository.findActiveByUserId(userId);

    // 2. Si no hay sesión activa, no hay nada que hacer
    if (!session) {
      return;
    }

    // 3. Revocar la sesión (lógica de dominio)
    session.revoke();

    // 4. Guardar cambios
    await this.sessionRepository.save(session);
  }
}
