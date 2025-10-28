// src/sesiones-caja/dto/cerrar-sesion-caja.dto.ts
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CerrarSesionCajaDto {
  @ApiProperty({ required: true })
  @IsNumber()
  monto_contado_final: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notas_cierre?: string;
}
