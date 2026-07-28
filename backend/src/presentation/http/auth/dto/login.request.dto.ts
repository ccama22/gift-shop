import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO de entrada HTTP para login de usuario.
 * Validaciones automáticas con class-validator.
 */
export class LoginRequestDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Correo electrónico del usuario registrado',
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    example: 'User123!',
    description: 'Contraseña del usuario',
  })
  @IsString()
  @IsNotEmpty()
  password!: string;
}
