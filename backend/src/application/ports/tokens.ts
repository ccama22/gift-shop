/**
 * Tokens de inyección de dependencias para NestJS.
 * Permiten usar interfaces como tokens de DI.
 */

// Repositories
export const IUserRepository = Symbol('IUserRepository');
export const ISessionRepository = Symbol('ISessionRepository');
export const ICategoryRepository = Symbol('ICategoryRepository');
export const IProductRepository = Symbol('IProductRepository');
export const IOrderRepository = Symbol('IOrderRepository');

// Services
export const ITokenService = Symbol('ITokenService');
export const IPasswordHasher = Symbol('IPasswordHasher');
export const IDateTimeService = Symbol('IDateTimeService');

// Use Cases
export const IRegisterUserUseCase = Symbol('IRegisterUserUseCase');
export const ILoginUserUseCase = Symbol('ILoginUserUseCase');
export const IRefreshTokenUseCase = Symbol('IRefreshTokenUseCase');
export const ILogoutUserUseCase = Symbol('ILogoutUserUseCase');
