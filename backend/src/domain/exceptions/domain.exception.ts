/**
 * Excepción base para todas las excepciones de dominio.
 * Las excepciones de dominio representan violaciones de reglas de negocio,
 * NO errores técnicos de infraestructura.
 */
export abstract class DomainException extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
