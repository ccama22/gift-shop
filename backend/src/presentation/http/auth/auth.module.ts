import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Presentation
import { AuthController } from './auth.controller';
import { JwtStrategy } from './guards';
import { CookieService } from './services';

// Application (Ports & Use Cases)
import {
  RegisterUserUseCaseImpl,
  LoginUserUseCaseImpl,
  RefreshTokenUseCaseImpl,
  LogoutUserUseCaseImpl,
} from '../../../application';

import * as DI_TOKENS from '../../../application/ports/tokens';

// Infrastructure
import {
  UserOrmEntity,
  SessionOrmEntity,
  UserRepositoryImpl,
  SessionRepositoryImpl,
  JwtTokenServiceImpl,
  BcryptPasswordHasherService,
  SystemDateTimeService,
} from '../../../infrastructure';

/**
 * Módulo de autenticación.
 * Configura la inyección de dependencias siguiendo Clean Architecture.
 */
@Module({
  imports: [
    // Módulos de NestJS
    PassportModule,
    ConfigModule,

    // Configuración de JWT
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_ACCESS_TOKEN_SECRET');

        if (!secret && configService.get('NODE_ENV') === 'production') {
          throw new Error('JWT_ACCESS_TOKEN_SECRET is required in production');
        }

        return {
          secret:
            secret || 'dev-secret-only-for-development-CHANGE-IN-PRODUCTION',
          signOptions: { expiresIn: '15m' },
        };
      },
    }),

    // Entidades TypeORM
    TypeOrmModule.forFeature([UserOrmEntity, SessionOrmEntity]),
  ],

  controllers: [AuthController],

  providers: [
    // Strategy de Passport
    JwtStrategy,

    // Servicios de presentación
    CookieService,

    // ==================== INFRASTRUCTURE LAYER ====================
    // Repositories
    {
      provide: DI_TOKENS.IUserRepository,
      useClass: UserRepositoryImpl,
    },
    {
      provide: DI_TOKENS.ISessionRepository,
      useClass: SessionRepositoryImpl,
    },

    // Services
    {
      provide: DI_TOKENS.ITokenService,
      useClass: JwtTokenServiceImpl,
    },
    {
      provide: DI_TOKENS.IPasswordHasher,
      useClass: BcryptPasswordHasherService,
    },
    {
      provide: DI_TOKENS.IDateTimeService,
      useClass: SystemDateTimeService,
    },

    // ==================== APPLICATION LAYER ====================
    // Use Cases
    {
      provide: DI_TOKENS.IRegisterUserUseCase,
      useFactory: (
        userRepo,
        sessionRepo,
        tokenService,
        passwordHasher,
        dateTimeService,
      ) => {
        return new RegisterUserUseCaseImpl(
          userRepo,
          sessionRepo,
          tokenService,
          passwordHasher,
          dateTimeService,
        );
      },
      inject: [
        DI_TOKENS.IUserRepository,
        DI_TOKENS.ISessionRepository,
        DI_TOKENS.ITokenService,
        DI_TOKENS.IPasswordHasher,
        DI_TOKENS.IDateTimeService,
      ],
    },

    {
      provide: DI_TOKENS.ILoginUserUseCase,
      useFactory: (
        userRepo,
        sessionRepo,
        tokenService,
        passwordHasher,
        dateTimeService,
      ) => {
        return new LoginUserUseCaseImpl(
          userRepo,
          sessionRepo,
          tokenService,
          passwordHasher,
          dateTimeService,
        );
      },
      inject: [
        DI_TOKENS.IUserRepository,
        DI_TOKENS.ISessionRepository,
        DI_TOKENS.ITokenService,
        DI_TOKENS.IPasswordHasher,
        DI_TOKENS.IDateTimeService,
      ],
    },

    {
      provide: DI_TOKENS.IRefreshTokenUseCase,
      useFactory: (
        userRepo,
        sessionRepo,
        tokenService,
        passwordHasher,
        dateTimeService,
      ) => {
        return new RefreshTokenUseCaseImpl(
          userRepo,
          sessionRepo,
          tokenService,
          passwordHasher,
          dateTimeService,
        );
      },
      inject: [
        DI_TOKENS.IUserRepository,
        DI_TOKENS.ISessionRepository,
        DI_TOKENS.ITokenService,
        DI_TOKENS.IPasswordHasher,
        DI_TOKENS.IDateTimeService,
      ],
    },

    {
      provide: DI_TOKENS.ILogoutUserUseCase,
      useFactory: (sessionRepo) => {
        return new LogoutUserUseCaseImpl(sessionRepo);
      },
      inject: [DI_TOKENS.ISessionRepository],
    },
  ],

  exports: [
    // Exportar para uso en otros módulos
    DI_TOKENS.IUserRepository,
    DI_TOKENS.ISessionRepository,
    JwtStrategy,
  ],
})
export class AuthModule {}
