/**
 * Value Object para representar un email válido.
 * Inmutable y auto-validado.
 */
export class Email {
  private readonly value: string;

  private constructor(email: string) {
    this.value = email;
  }

  /**
   * Crea un Email validando el formato.
   * @throws Error si el formato es inválido
   */
  static create(email: string): Email {
    if (!email || email.trim().length === 0) {
      throw new Error('El email no puede estar vacío');
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Regex básico pero efectivo para validar emails
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      throw new Error('El formato del email es inválido');
    }

    if (normalizedEmail.length > 255) {
      throw new Error('El email no puede exceder 255 caracteres');
    }

    return new Email(normalizedEmail);
  }

  /**
   * Retorna el valor del email normalizado (lowercase).
   */
  getValue(): string {
    return this.value;
  }

  /**
   * Compara si dos emails son iguales.
   */
  equals(other: Email): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
