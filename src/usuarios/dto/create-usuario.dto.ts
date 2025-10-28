import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsBoolean,
} from 'class-validator';

export class CreateUsuarioDto {
  @ApiProperty({
    required: true,
    description: 'Nombre de usuario para login',
    example: 'jdoe',
  })
  @IsString()
  @IsNotEmpty()
  nombre_usuario: string;

  @ApiProperty({
    required: true,
    description: 'Hash de la contraseña (almacenado en BD)',
    example: 'hashed_password_here',
  })
  @IsString()
  @IsNotEmpty()
  hash_contrasena: string;

  @ApiProperty({
    required: false,
    description: 'Nombre completo del usuario',
    example: 'Juan Pérez',
  })
  @IsOptional()
  @IsString()
  nombre_completo?: string;

  @ApiProperty({
    required: true,
    description: 'ID del rol asignado al usuario',
    example: 2,
  })
  @IsInt()
  rol_id: number;

  @ApiProperty({
    required: false,
    description: 'Indica si el usuario está activo',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
