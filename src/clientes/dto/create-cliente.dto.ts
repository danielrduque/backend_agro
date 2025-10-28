import { ApiProperty } from '@nestjs/swagger';
// src/clientes/dto/create-cliente.dto.ts

import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsEmail,
} from 'class-validator';

export class CreateClienteDto {
  @ApiProperty({
    required: true,
    description: 'Nombre completo del cliente',
    example: 'Empresa Agro S.A.',
  })
  @IsString()
  @IsNotEmpty()
  nombre_completo: string;

  @ApiProperty({
    required: true,
    description: 'Tipo de documento (ID)',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  tipo_documento_id: number;

  @ApiProperty({
    required: false,
    description: 'Número de documento del cliente',
    example: '12345678',
  })
  @IsString()
  @IsOptional() // El documento puede ser opcional
  numero_documento?: string;

  @ApiProperty({
    required: false,
    description: 'Teléfono de contacto',
    example: '3001234567',
  })
  @IsString()
  @IsOptional()
  telefono?: string;

  @ApiProperty({
    required: false,
    description: 'Correo electrónico',
    example: 'cliente@example.com',
  })
  @IsEmail() // Valida que sea un formato de email correcto
  @IsOptional()
  email?: string;

  @ApiProperty({
    required: false,
    description: 'Dirección física',
    example: 'Calle 123 #45-67',
  })
  @IsString()
  @IsOptional()
  direccion?: string;

  @ApiProperty({
    required: false,
    description: 'Lista de precios asignada (ID)',
    example: 1,
  })
  @IsInt()
  @IsOptional()
  lista_precio_id?: number;
}
