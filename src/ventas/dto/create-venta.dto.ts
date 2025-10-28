import {
  IsInt,
  IsNumber,
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDetalleVentaDto {
  @IsInt()
  producto_id: number;

  @IsNumber()
  cantidad: number;

  @IsNumber()
  precio_unitario_venta: number;

  @IsNumber()
  precio_costo_en_venta: number;

  @IsNumber()
  subtotal_linea: number;

  @IsNumber()
  impuestos_linea: number;

  @IsNumber()
  total_linea: number;
}

export class CreateVentaDto {
  @IsInt()
  cliente_id: number;

  @IsInt()
  usuario_id: number;

  @IsInt()
  sesion_caja_id: number;

  @IsInt()
  metodo_pago_id: number;

  @IsInt()
  estado_id: number;

  @IsOptional()
  @IsString()
  numero_factura?: string;

  @IsNumber()
  subtotal: number;

  @IsNumber()
  impuestos: number;

  @IsNumber()
  total: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDetalleVentaDto)
  detalles: CreateDetalleVentaDto[];
}
