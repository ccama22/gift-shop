import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsOptional,
  IsBoolean,
  IsUUID,
  MaxLength,
  IsArray,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductRequestDto {
  @ApiProperty({ description: 'Nombre del producto', example: 'Ramo de Rosas' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name!: string;

  @ApiPropertyOptional({
    description: 'Descripción del producto',
    example: 'Hermoso ramo de rosas rojas',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Precio del producto', example: 150.0 })
  @IsNumber()
  @Min(0)
  price!: number;

  @ApiProperty({ description: 'Cantidad en stock', example: 10 })
  @IsNumber()
  @Min(0)
  stock!: number;

  @ApiProperty({
    description: 'ID de la categoría',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  categoryId!: string;

  @ApiPropertyOptional({
    description: 'Estado de activación del producto',
    default: true,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Es un combo de productos',
    default: false,
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  isCombo?: boolean;

  @ApiPropertyOptional({
    description: 'URL de la imagen del producto',
    example: 'products/image123.jpg',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  imageUrl?: string;

  @ApiPropertyOptional({
    description: 'Nivel de alerta de stock bajo',
    example: 5,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  lowStockAlert?: number;

  @ApiPropertyOptional({
    description: 'Código SKU del producto',
    example: 'RAMO-001',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  sku?: string;

  @ApiPropertyOptional({
    description: 'Etiquetas del producto',
    example: ['especial', 'promoción'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
