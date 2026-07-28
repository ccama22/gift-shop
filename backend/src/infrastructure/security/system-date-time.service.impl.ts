import { Injectable } from '@nestjs/common';
import { IDateTimeService } from '../../application';

/**
 * Implementación de IDateTimeService usando el sistema.
 * Útil para testing (puede ser mockeada fácilmente).
 */
@Injectable()
export class SystemDateTimeService implements IDateTimeService {
  now(): Date {
    return new Date();
  }

  addSeconds(date: Date, seconds: number): Date {
    const result = new Date(date);
    result.setSeconds(result.getSeconds() + seconds);
    return result;
  }
}
