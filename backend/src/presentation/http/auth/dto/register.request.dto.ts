import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO de entrada HTTP para registro de usuario.
 * Validaciones automáticas con class-validator.
 */
export class RegisterRequestDto {
  @ApiProperty({
    example: 'Juan Perez',
    description: 'Nombre completo del nuevo usuario',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 200)
  name!: string;

  @ApiProperty({
    example: 'juan.perez@example.com',
    description: 'Correo electrónico único',
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'Contraseña segura (mínimo 8 caracteres)',
  })
  @IsString()
  @IsNotEmpty()
  @Length(8, 72)
  password!: string;
}
