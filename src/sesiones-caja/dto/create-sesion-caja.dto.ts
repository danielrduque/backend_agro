import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSesionCajaDto {
  @ApiProperty({ required: true })
  @IsInt()
  usuario_id: number;

  @ApiProperty({ required: true })
  @IsInt()
  caja_id: number;

  @ApiProperty({ required: true })
  @IsInt()
  estado_id: number;

  @ApiProperty({ required: true })
  @IsNumber()
  monto_base_inicial: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  monto_contado_final?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  monto_esperado_final?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notas_cierre?: string;
}
