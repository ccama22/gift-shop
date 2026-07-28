import { v4 as uuidv4 } from 'uuid';
import { ILoginUserUseCase } from '../../ports/in/auth';
import { LoginUserDto, AuthResponseDto } from '../../dto/auth';
import {
  IUserRepository,
  ISessionRepository,
} from '../../ports/out/repositories';
import {
  ITokenService,
  IPasswordHasher,
  IDateTimeService,
} from '../../ports/out/services';
import { SessionDomain } from '../../../domain';
import { Email, Password } from '../../../domain/value-objects';
import { InvalidCredentialsException } from '../../../domain/exceptions';

/**
 * Tiempos de expiración (en segundos)
 */
const ACCESS_TOKEN_EXPIRY = 15 * 60; // 15 minutos
const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60; // 7 días

/**
 * Implementación del caso de uso de login de usuario.
 * Valida credenciales y genera tokens de autenticación.
 */
export class LoginUserUseCaseImpl implements ILoginUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly sessionRepository: ISessionRepository,
    private readonly tokenService: ITokenService,
    private readonly passwordHasher: IPasswordHasher,
    private readonly dateTimeService: IDateTimeService,
  ) {}

  async execute(dto: LoginUserDto): Promise<AuthResponseDto> {
    // 1. Buscar usuario por email
    const email = Email.create(dto.email);
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new InvalidCredentialsException();
    }

    // 2. Verificar que el usuario esté activo
    if (!user.isActive()) {
      throw new InvalidCredentialsException();
    }

    // 3. Validar la contraseña
    const plainPassword = Password.create(dto.password);
    const isPasswordValid = await this.passwordHasher.compare(
      plainPassword,
      user.getPassword(),
    );

    if (!isPasswordValid) {
      throw new InvalidCredentialsException();
    }

    // 4. Generar tokens
    const accessToken = await this.tokenService.generateAccessToken(
      user.getId(),
      user.getEmail().getValue(),
      ACCESS_TOKEN_EXPIRY,
    );

    const refreshToken = await this.tokenService.generateRefreshToken(
      user.getId(),
      REFRESH_TOKEN_EXPIRY,
    );

    // 5. Hashear el refresh token
    const refreshTokenPassword = Password.fromHash(refreshToken.getValue());
    const hashedRefreshToken =
      await this.passwordHasher.hash(refreshTokenPassword);

    // 6. Crear nueva sesión activa (invalida sesiones anteriores automáticamente)
    const sessionExpiresAt = this.dateTimeService.addSeconds(
      this.dateTimeService.now(),
      REFRESH_TOKEN_EXPIRY,
    );

    const session = SessionDomain.create({
      id: uuidv4(),
      userId: user.getId(),
      refreshTokenHash: hashedRefreshToken.getValue(),
      expiresAt: sessionExpiresAt,
    });

    // 7. Guardar sesión
    await this.sessionRepository.save(session);

    // 8. Retornar respuesta
    return {
      accessToken: accessToken.getValue(),
      refreshToken: refreshToken.getValue(),
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
