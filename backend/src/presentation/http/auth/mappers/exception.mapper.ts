/**
 * Mapper para convertir excepciones de dominio a excepciones HTTP
 * Principio: Single Responsibility - solo mapea excepciones
 * Principio: Dependency Inversion - depende de abstracciones (excepciones de dominio)
 */

import {
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import {
  UserAlreadyExistsException,
  InvalidCredentialsException,
  InvalidRefreshTokenException,
  SessionExpiredException,
} from '../../../../domain/exceptions';

export class ExceptionMapper {
  /**
   * Mapea excepciones de dominio a excepciones HTTP de NestJS
   */
  static mapToHttpException(error: Error): never {
    // Excepciones de conflicto (409)
    if (error instanceof UserAlreadyExistsException) {
      throw new ConflictException(error.message);
    }

    // Excepciones de autenticación (401)
    if (
      error instanceof InvalidCredentialsException ||
      error instanceof InvalidRefreshTokenException ||
      error instanceof SessionExpiredException
    ) {
      throw new UnauthorizedException(error.message);
    }

    // Excepciones de validación (400)
    if (error instanceof Error && error.name === 'ValidationError') {
      throw new BadRequestException(error.message);
    }

    // Re-lanzar error desconocido
    throw error;
  }
}
