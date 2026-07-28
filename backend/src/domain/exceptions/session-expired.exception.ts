import { DomainException } from './domain.exception';

/**
 * Se lanza cuando una sesión ha expirado.
 */
export class SessionExpiredException extends DomainException {
  constructor() {
    super('La sesión ha expirado', 'SESSION_EXPIRED');
  }
}
