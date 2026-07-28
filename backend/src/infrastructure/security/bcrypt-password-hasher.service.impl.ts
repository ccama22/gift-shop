import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { IPasswordHasher } from '../../application';
import { Password } from '../../domain/value-objects';

/**
 * Implementación de IPasswordHasher usando bcrypt.
 * Capa de infraestructura - depende de librería externa.
 */
@Injectable()
export class BcryptPasswordHasherService implements IPasswordHasher {
  private readonly saltRounds = 12;

  async hash(password: Password): Promise<Password> {
    const plainValue = password.getValue();
    const hashed = await bcrypt.hash(plainValue, this.saltRounds);
    return Password.fromHash(hashed);
  }

  async compare(
    plainPassword: Password,
    hashedPassword: Password,
  ): Promise<boolean> {
    const plainValue = plainPassword.getValue();
    const hashedValue = hashedPassword.getValue();
    return bcrypt.compare(plainValue, hashedValue);
  }
}
