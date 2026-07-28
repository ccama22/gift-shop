/**
 * Puerto de salida para obtener fecha/hora actual.
 * Útil para testing (permite mockear el tiempo).
 */
export interface IDateTimeService {
  /**
   * Retorna la fecha y hora actual.
   */
  now(): Date;

  /**
   * Calcula una fecha futura agregando segundos.
   */
  addSeconds(date: Date, seconds: number): Date;
}
