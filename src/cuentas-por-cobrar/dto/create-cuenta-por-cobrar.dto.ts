import { IsInt, IsNumber, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCuentaPorCobrarDto {
  @ApiProperty({ required: true })
  @IsInt()
  venta_id: number;

  @ApiProperty({ required: true })
  @IsInt()
  cliente_id: number;

  @ApiProperty({ required: true })
  @IsInt()
  estado_id: number;

  @ApiProperty({ required: true })
  @IsNumber()
  monto_total: number;

  @ApiProperty({ required: true })
  @IsNumber()
  saldo_pendiente: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  fecha_vencimiento?: string;
}
