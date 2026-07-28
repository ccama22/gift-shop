import { v4 as uuidv4 } from 'uuid';
import { IRegisterUserUseCase } from '../../ports/in/auth';
import { RegisterUserDto, AuthResponseDto } from '../../dto/auth';
import {
  IUserRepository,
  ISessionRepository,
} from '../../ports/out/repositories';
import {
  ITokenService,
  IPasswordHasher,
  IDateTimeService,
} from '../../ports/out/services';
import { UserDomain, SessionDomain } from '../../../domain';
import { Email, Password } from '../../../domain/value-objects';
import { UserAlreadyExistsException } from '../../../domain/exceptions';

/**
 * Tiempos de expiración (en segundos)
 */
const ACCESS_TOKEN_EXPIRY = 15 * 60; // 15 minutos
const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60; // 7 días

/**
 * Implementación del caso de uso de registro de usuario.
 * Orquesta la creación de un nuevo usuario y su sesión inicial.
 */
export class RegisterUserUseCaseImpl implements IRegisterUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly sessionRepository: ISessionRepository,
    private readonly tokenService: ITokenService,
    private readonly passwordHasher: IPasswordHasher,
    private readonly dateTimeService: IDateTimeService,
  ) {}

  async execute(dto: RegisterUserDto): Promise<AuthResponseDto> {
    // 1. Validar que el email no exista (regla de negocio)
    const email = Email.create(dto.email);
    const userExists = await this.userRepository.existsByEmail(email);

    if (userExists) {
      throw new UserAlreadyExistsException(email.getValue());
    }

    // 2. Crear contraseña validada
    const plainPassword = Password.create(dto.password);

    // 3. Hashear la contraseña
    const hashedPassword = await this.passwordHasher.hash(plainPassword);

    // 4. Crear entidad de usuario
    const user = UserDomain.create({
      id: uuidv4(),
      email,
      name: dto.name,
      password: hashedPassword,
    });

    // 5. Guardar usuario
    const savedUser = await this.userRepository.save(user);

    // 6. Generar tokens
    const accessToken = await this.tokenService.generateAccessToken(
      savedUser.getId(),
      savedUser.getEmail().getValue(),
      ACCESS_TOKEN_EXPIRY,
    );

    const refreshToken = await this.tokenService.generateRefreshToken(
      savedUser.getId(),
      REFRESH_TOKEN_EXPIRY,
    );

    // 7. Hashear el refresh token para guardarlo
    const refreshTokenPassword = Password.fromHash(refreshToken.getValue());
    const hashedRefreshToken =
      await this.passwordHasher.hash(refreshTokenPassword);

    // 8. Crear sesión activa
    const sessionExpiresAt = this.dateTimeService.addSeconds(
      this.dateTimeService.now(),
      REFRESH_TOKEN_EXPIRY,
    );

    const session = SessionDomain.create({
      id: uuidv4(),
      userId: savedUser.getId(),
      refreshTokenHash: hashedRefreshToken.getValue(),
      expiresAt: sessionExpiresAt,
    });

    // 9. Guardar sesión
    await this.sessionRepository.save(session);

    // 10. Retornar respuesta
    return {
      accessToken: accessToken.getValue(),
      refreshToken: refreshToken.getValue(),
      tokenType: 'Bearer',
      expiresIn: ACCESS_TOKEN_EXPIRY,
      refreshExpiresIn: REFRESH_TOKEN_EXPIRY,
      user: {
        id: savedUser.getId(),
        email: savedUser.getEmail().getValue(),
        name: savedUser.getName(),
        role: savedUser.getRole(),
      },
    };
  }
}
