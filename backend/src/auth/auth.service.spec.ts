import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { Session } from './entities/session.entity';
import { User } from './entities/user.entity';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: {
    findOne: jest.Mock;
    create: jest.Mock;
    save: jest.Mock;
    createQueryBuilder: jest.Mock;
  };
  let sessionRepository: {
    findOne: jest.Mock;
    create: jest.Mock;
    save: jest.Mock;
  };
  let jwtService: {
    signAsync: jest.Mock;
    verifyAsync: jest.Mock;
  };
  let configService: {
    get: jest.Mock;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            createQueryBuilder: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Session),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
            verifyAsync: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get(getRepositoryToken(User));
    sessionRepository = module.get(getRepositoryToken(Session));
    jwtService = module.get(JwtService);
    configService = module.get(ConfigService);

    configService.get.mockReturnValue('dev-secret');
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-value');
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('crea una sesión activa y devuelve tokens', async () => {
      userRepository.findOne.mockResolvedValue(null);

      const savedUser: User = {
        id: 'user-1',
        name: 'Ana',
        email: 'ana@example.com',
        passwordHash: 'hashed-password',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      userRepository.create.mockReturnValue(savedUser);
      userRepository.save.mockResolvedValue(savedUser);
      const session: Session = {
        id: 'session-1',
        userId: 'user-1',
        user: savedUser,
        refreshTokenHash: 'hashed-refresh-token',
        accessTokenJti: null,
        refreshTokenJti: null,
        isActive: true,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        revokedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      sessionRepository.create.mockReturnValue(session);
      sessionRepository.save.mockResolvedValue(session);
      jwtService.signAsync.mockResolvedValueOnce('access-token-jwt');
      jwtService.signAsync.mockResolvedValueOnce('refresh-token-jwt');

      const result = await service.register({
        name: 'Ana',
        email: 'ana@example.com',
        password: '12345678',
      });

      expect(result.accessToken).toBe('access-token-jwt');
      expect(result.refreshToken).toBe('refresh-token-jwt');
      expect(result.tokenType).toBe('Bearer');
      expect(result.expiresIn).toBe(15 * 60);
      expect(result.refreshExpiresIn).toBe(7 * 24 * 60 * 60);
      expect(sessionRepository.save).toHaveBeenCalled();
    });

    it('lanza conflicto si el correo ya existe', async () => {
      userRepository.findOne.mockResolvedValue({ email: 'ana@example.com' });

      await expect(
        service.register({
          name: 'Ana',
          email: 'ana@example.com',
          password: '12345678',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('devuelve acceso y refresh tokens para credenciales válidas', async () => {
      const user: User = {
        id: 'user-1',
        name: 'Ana',
        email: 'ana@example.com',
        passwordHash: 'hashed-password',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const queryBuilder = {
        where: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(user),
      };

      userRepository.createQueryBuilder.mockReturnValue(queryBuilder);

      const session: Session = {
        id: 'session-1',
        userId: 'user-1',
        user,
        refreshTokenHash: 'hashed-refresh-token',
        accessTokenJti: null,
        refreshTokenJti: null,
        isActive: true,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        revokedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      sessionRepository.create.mockReturnValue(session);
      sessionRepository.save.mockResolvedValue(session);
      jwtService.signAsync.mockResolvedValueOnce('access-token-jwt');
      jwtService.signAsync.mockResolvedValueOnce('refresh-token-jwt');

      const result = await service.login({
        email: 'ana@example.com',
        password: '12345678',
      });

      expect(result.accessToken).toBe('access-token-jwt');
      expect(result.refreshToken).toBe('refresh-token-jwt');
    });

    it('lanza UnauthorizedException para credenciales inválidas', async () => {
      const queryBuilder = {
        where: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      };

      userRepository.createQueryBuilder.mockReturnValue(queryBuilder);

      await expect(
        service.login({
          email: 'ana@example.com',
          password: 'wrong-password',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('refresh', () => {
    it('devuelve nuevos tokens con refresh token válido', async () => {
      const user: User = {
        id: 'user-1',
        name: 'Ana',
        email: 'ana@example.com',
        passwordHash: 'hashed-password',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const session: Session = {
        id: 'session-1',
        userId: 'user-1',
        user,
        refreshTokenHash: 'hashed-refresh-token',
        accessTokenJti: null,
        refreshTokenJti: null,
        isActive: true,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        revokedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      sessionRepository.findOne.mockResolvedValue(session);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jwtService.signAsync.mockResolvedValueOnce('new-access-token');
      jwtService.signAsync.mockResolvedValueOnce('new-refresh-token');

      const result = await service.refresh('user-1', 'refresh-token-jwt');

      expect(result.accessToken).toBe('new-access-token');
      expect(result.refreshToken).toBe('new-refresh-token');
      expect(sessionRepository.findOne).toHaveBeenCalledWith({
        where: { userId: 'user-1', isActive: true },
        relations: { user: true },
      });
    });

    it('lanza UnauthorizedException si refresh token es inválido', async () => {
      const session: Session = {
        id: 'session-1',
        userId: 'user-1',
        user: {} as User,
        refreshTokenHash: 'hashed-refresh-token',
        accessTokenJti: null,
        refreshTokenJti: null,
        isActive: true,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        revokedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      sessionRepository.findOne.mockResolvedValue(session);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.refresh('user-1', 'invalid-refresh-token'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('lanza UnauthorizedException si sesión está expirada', async () => {
      const session: Session = {
        id: 'session-1',
        userId: 'user-1',
        user: {} as User,
        refreshTokenHash: 'hashed-refresh-token',
        accessTokenJti: null,
        refreshTokenJti: null,
        isActive: true,
        expiresAt: new Date(Date.now() - 1000), // Expirada
        revokedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      sessionRepository.findOne.mockResolvedValue(session);

      await expect(
        service.refresh('user-1', 'refresh-token-jwt'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('verifyRefreshToken', () => {
    it('devuelve payload si token es válido', async () => {
      const payload = { sub: 'user-1', type: 'refresh' };
      jwtService.verifyAsync.mockResolvedValue(payload);

      const result = await service.verifyRefreshToken('valid-token');

      expect(result).toEqual(payload);
    });

    it('lanza UnauthorizedException si token es inválido', async () => {
      jwtService.verifyAsync.mockRejectedValue(new Error('Invalid token'));

      await expect(service.verifyRefreshToken('invalid-token')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('revokeSession', () => {
    it('marca sesión como inactiva y limpia refresh token', async () => {
      const session: Session = {
        id: 'session-1',
        userId: 'user-1',
        user: {} as User,
        refreshTokenHash: 'hashed-refresh-token',
        accessTokenJti: null,
        refreshTokenJti: null,
        isActive: true,
        expiresAt: new Date(),
        revokedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      sessionRepository.findOne.mockResolvedValue(session);

      await service.revokeSession('user-1');

      expect(sessionRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          isActive: false,
          refreshTokenHash: null,
        }),
      );
    });
  });
});
