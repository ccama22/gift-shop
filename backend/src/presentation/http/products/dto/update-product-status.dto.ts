import { IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductStatusDto {
  @ApiProperty({
    description: 'Estado de activación del producto',
    example: true,
  })
  @IsBoolean()
  isActive!: boolean;
}
