import { IsInt, IsNumber, IsOptional, IsDateString } from 'class-validator';

export class CreateCuentaPorCobrarDto {
  @IsInt()
  venta_id: number;

  @IsInt()
  cliente_id: number;

  @IsInt()
  estado_id: number;

  @IsNumber()
  monto_total: number;

  @IsNumber()
  saldo_pendiente: number;

  @IsOptional()
  @IsDateString()
  fecha_vencimiento?: string;
}
