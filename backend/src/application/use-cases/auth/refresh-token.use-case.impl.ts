import { IRefreshTokenUseCase } from '../../ports/in/auth';
import { RefreshTokenDto, AuthResponseDto } from '../../dto/auth';
import {
  IUserRepository,
  ISessionRepository,
} from '../../ports/out/repositories';
import {
  ITokenService,
  IPasswordHasher,
  IDateTimeService,
} from '../../ports/out/services';
import { Token, Password } from '../../../domain/value-objects';
import {
  InvalidRefreshTokenException,
  InvalidCredentialsException,
} from '../../../domain/exceptions';

/**
 * Tiempos de expiración (en segundos)
 */
const ACCESS_TOKEN_EXPIRY = 15 * 60; // 15 minutos
const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60; // 7 días

/**
 * Implementación del caso de uso de renovación de tokens.
 * Valida el refresh token y genera nuevos tokens.
 */
export class RefreshTokenUseCaseImpl implements IRefreshTokenUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly sessionRepository: ISessionRepository,
    private readonly tokenService: ITokenService,
    private readonly passwordHasher: IPasswordHasher,
    private readonly dateTimeService: IDateTimeService,
  ) {}

  async execute(dto: RefreshTokenDto): Promise<AuthResponseDto> {
    // 1. Validar formato del refresh token
    const refreshToken = Token.create(dto.refreshToken);

    // 2. Verificar y decodificar el refresh token
    let payload;
    try {
      payload = await this.tokenService.verifyRefreshToken(refreshToken);
    } catch {
      throw new InvalidRefreshTokenException();
    }

    // 3. Validar que el userId del token coincida con el del DTO (seguridad)
    if (payload.sub !== dto.userId) {
      throw new InvalidRefreshTokenException();
    }

    // 4. Buscar la sesión activa del usuario
    const session = await this.sessionRepository.findActiveByUserId(dto.userId);

    if (!session) {
      throw new InvalidRefreshTokenException();
    }

    // 5. Validar que la sesión no haya expirado
    try {
      session.validateNotExpired(this.dateTimeService.now());
    } catch {
      // Si expiró, marcar la sesión y lanzar excepción
      session.markAsExpired();
      await this.sessionRepository.save(session);
      throw new InvalidRefreshTokenException();
    }

    // 6. Validar que el refresh token coincida con el hash guardado
    const refreshTokenPassword = Password.fromHash(refreshToken.getValue());
    const storedHash = Password.fromHash(session.getRefreshTokenHash()!);

    const isRefreshTokenValid = await this.passwordHasher.compare(
      refreshTokenPassword,
      storedHash,
    );

    if (!isRefreshTokenValid) {
      throw new InvalidRefreshTokenException();
    }

    // 7. Buscar el usuario (para generar el nuevo access token con su info)
    const user = await this.userRepository.findById(dto.userId);

    if (!user || !user.isActive()) {
      throw new InvalidCredentialsException();
    }

    // 8. Generar nuevos tokens
    const newAccessToken = await this.tokenService.generateAccessToken(
      user.getId(),
      user.getEmail().getValue(),
      ACCESS_TOKEN_EXPIRY,
    );

    const newRefreshToken = await this.tokenService.generateRefreshToken(
      user.getId(),
      REFRESH_TOKEN_EXPIRY,
    );

    // 9. Hashear el nuevo refresh token
    const newRefreshTokenPassword = Password.fromHash(
      newRefreshToken.getValue(),
    );
    const hashedNewRefreshToken = await this.passwordHasher.hash(
      newRefreshTokenPassword,
    );

    // 10. Actualizar la sesión con el nuevo hash
    session.updateRefreshTokenHash(hashedNewRefreshToken.getValue());
    await this.sessionRepository.save(session);

    // 11. Retornar respuesta
    return {
      accessToken: newAccessToken.getValue(),
      refreshToken: newRefreshToken.getValue(),
      tokenType: 'Bearer',
      expiresIn: ACCESS_TOKEN_EXPIRY,
      refreshExpiresIn: REFRESH_TOKEN_EXPIRY,
      user: {
        id: user.getId(),
        email: user.getEmail().getValue(),
        name: user.getName(),
        role: user.getRole(),
      },
    };
  }
}
