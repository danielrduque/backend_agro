// src/sesiones-caja/dto/cerrar-sesion-caja.dto.ts
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CerrarSesionCajaDto {
  @IsNumber()
  monto_contado_final: number;

  @IsOptional()
  @IsString()
  notas_cierre?: string;
}
