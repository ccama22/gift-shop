/**
 * Value Object para representar un token JWT.
 * Valida el formato básico.
 */
export class Token {
  private readonly value: string;

  private constructor(token: string) {
    this.value = token;
  }

  /**
   * Crea un Token validando el formato JWT.
   * @throws Error si el formato es inválido
   */
  static create(token: string): Token {
    if (!token || token.trim().length === 0) {
      throw new Error('El token no puede estar vacío');
    }

    const trimmedToken = token.trim();

    // Un JWT válido tiene 3 partes separadas por puntos
    const parts = trimmedToken.split('.');
    if (parts.length !== 3) {
      throw new Error('El formato del token es inválido');
    }

    // Cada parte debe tener contenido
    if (parts.some((part) => part.length === 0)) {
      throw new Error('El token contiene partes vacías');
    }

    return new Token(trimmedToken);
  }

  /**
   * Retorna el valor del token.
   */
  getValue(): string {
    return this.value;
  }

  /**
   * Compara si dos tokens son iguales.
   */
  equals(other: Token): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
