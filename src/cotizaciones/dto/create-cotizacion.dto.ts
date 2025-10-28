import {
  IsInt,
  IsNumber,
  IsOptional,
  IsArray,
  ValidateNested,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDetalleCotizacionDto {
  @IsInt()
  producto_id: number;

  @IsNumber()
  cantidad: number;

  @IsNumber()
  precio_unitario: number;

  @IsNumber()
  total_linea: number;
}

export class CreateCotizacionDto {
  @IsInt()
  cliente_id: number;

  @IsInt()
  usuario_id: number;

  @IsInt()
  estado_id: number;

  @IsOptional()
  @IsDateString()
  fecha_vencimiento?: string;

  @IsOptional()
  @IsNumber()
  total?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDetalleCotizacionDto)
  detalles: CreateDetalleCotizacionDto[];
}
