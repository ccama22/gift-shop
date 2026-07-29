// ============================================
// AUTH MODELS
// ============================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  createdAt?: string;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  MANAGER = 'MANAGER'
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}
