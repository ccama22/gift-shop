import { DomainException } from './domain.exception';

/**
 * Se lanza cuando el refresh token es inválido o ha expirado.
 */
export class InvalidRefreshTokenException extends DomainException {
  constructor() {
    super('Refresh token inválido o expirado', 'INVALID_REFRESH_TOKEN');
  }
}
