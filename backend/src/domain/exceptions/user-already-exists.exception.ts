import { DomainException } from './domain.exception';

/**
 * Se lanza cuando se intenta registrar un usuario con un email que ya existe.
 */
export class UserAlreadyExistsException extends DomainException {
  constructor(email: string) {
    super(`El usuario con email ${email} ya existe`, 'USER_ALREADY_EXISTS');
  }
}
