/**
 * Value Object para representar una contraseña.
 * Contiene reglas de validación de fortaleza.
 */
export class Password {
  private readonly value: string;

  private constructor(password: string) {
    this.value = password;
  }

  /**
   * Crea una contraseña validando las reglas de fortaleza.
   * @throws Error si la contraseña no cumple los requisitos
   */
  static create(password: string): Password {
    if (!password || password.length === 0) {
      throw new Error('La contraseña no puede estar vacía');
    }

    if (password.length < 8) {
      throw new Error('La contraseña debe tener al menos 8 caracteres');
    }

    if (password.length > 72) {
      // bcrypt tiene un límite de 72 caracteres
      throw new Error('La contraseña no puede exceder 72 caracteres');
    }

    return new Password(password);
  }

  /**
   * Crea un Password desde un hash (para reconstruir desde BD).
   * No se valida porque ya es un hash.
   */
  static fromHash(hash: string): Password {
    return new Password(hash);
  }

  /**
   * Retorna el valor de la contraseña (solo para hasheo).
   */
  getValue(): string {
    return this.value;
  }

  /**
   * Verifica si esta contraseña es un hash.
   */
  isHashed(): boolean {
    // Los hashes de bcrypt empiezan con $2a$, $2b$, o $2y$
    return this.value.startsWith('$2');
  }
}
