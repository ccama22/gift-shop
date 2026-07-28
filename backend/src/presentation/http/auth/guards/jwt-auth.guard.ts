import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard de autenticación JWT.
 * Protege rutas que requieren autenticación.
 *
 * Uso: @UseGuards(JwtAuthGuard) en controladores o rutas.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
}
