import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSesionCajaDto {
  @IsInt()
  usuario_id: number;

  @IsInt()
  caja_id: number;

  @IsInt()
  estado_id: number;

  @IsNumber()
  monto_base_inicial: number;

  @IsOptional()
  @IsNumber()
  monto_contado_final?: number;

  @IsOptional()
  @IsNumber()
  monto_esperado_final?: number;

  @IsOptional()
  @IsString()
  notas_cierre?: string;
}
