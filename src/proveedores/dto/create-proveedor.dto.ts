import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProveedorDto {
  @ApiProperty({
    required: true,
    description: 'Nombre o razón social del proveedor',
    example: 'Proveedor Agro S.A.',
  })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({
    required: false,
    description: 'NIT o identificación fiscal',
    example: '900123456-7',
  })
  @IsOptional()
  @IsString()
  nit?: string;

  @ApiProperty({
    required: false,
    description: 'Persona de contacto principal',
    example: 'María Pérez',
  })
  @IsOptional()
  @IsString()
  contacto_principal?: string;

  @ApiProperty({
    required: false,
    description: 'Teléfono de contacto',
    example: '3001234567',
  })
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiProperty({
    required: false,
    description: 'Correo electrónico del proveedor',
    example: 'proveedor@example.com',
  })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({
    required: false,
    description: 'Dirección del proveedor',
    example: 'Km 5 Vía a La Planta',
  })
  @IsOptional()
  @IsString()
  direccion?: string;
}
