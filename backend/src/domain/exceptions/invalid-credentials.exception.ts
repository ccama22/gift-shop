import { DomainException } from './domain.exception';

/**
 * Se lanza cuando las credenciales de login son inválidas.
 */
export class InvalidCredentialsException extends DomainException {
  constructor() {
    super('Credenciales inválidas', 'INVALID_CREDENTIALS');
  }
}
