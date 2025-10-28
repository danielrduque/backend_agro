import {
  IsInt,
  IsNumber,
  IsOptional,
  IsArray,
  ValidateNested,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDetalleDevolucionDto {
  @ApiProperty({ required: true })
  @IsInt()
  producto_id: number;

  @ApiProperty({ required: true })
  @IsNumber()
  cantidad: number;

  @ApiProperty({ required: true })
  @IsNumber()
  precio_unitario_devolucion: number;

  @ApiProperty({ required: true })
  @IsNumber()
  total_linea: number;
}

export class CreateDevolucionDto {
  @ApiProperty({ required: true })
  @IsInt()
  venta_id_original: number;

  @ApiProperty({ required: true })
  @IsInt()
  usuario_id: number;

  @ApiProperty({ required: true })
  @IsInt()
  sesion_caja_id: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  motivo?: string;

  @ApiProperty({ required: true })
  @IsNumber()
  total_devuelto: number;

  @ApiProperty({ required: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDetalleDevolucionDto)
  detalles: CreateDetalleDevolucionDto[];
}
