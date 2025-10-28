// src/clientes/dto/create-cliente.dto.ts

import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsEmail,
} from 'class-validator';

export class CreateClienteDto {
  @IsString()
  @IsNotEmpty()
  nombre_completo: string;

  @IsInt()
  @IsNotEmpty()
  tipo_documento_id: number;

  @IsString()
  @IsOptional() // El documento puede ser opcional
  numero_documento?: string;

  @IsString()
  @IsOptional()
  telefono?: string;

  @IsEmail() // Valida que sea un formato de email correcto
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  direccion?: string;

  @IsInt()
  @IsOptional()
  lista_precio_id?: number;
}
