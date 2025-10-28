import {
  IsInt,
  IsNumber,
  IsOptional,
  IsArray,
  ValidateNested,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDetalleDevolucionDto {
  @IsInt()
  producto_id: number;

  @IsNumber()
  cantidad: number;

  @IsNumber()
  precio_unitario_devolucion: number;

  @IsNumber()
  total_linea: number;
}

export class CreateDevolucionDto {
  @IsInt()
  venta_id_original: number;

  @IsInt()
  usuario_id: number;

  @IsInt()
  sesion_caja_id: number;

  @IsOptional()
  @IsString()
  motivo?: string;

  @IsNumber()
  total_devuelto: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDetalleDevolucionDto)
  detalles: CreateDetalleDevolucionDto[];
}
