import {
  IsInt,
  IsNumber,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDetalleCompraDto {
  @IsInt()
  producto_id: number;

  @IsNumber()
  cantidad: number;

  @IsNumber()
  precio_costo_unitario: number;

  @IsNumber()
  total_linea: number;
}

export class CreateCompraDto {
  @IsInt()
  proveedor_id: number;

  @IsInt()
  usuario_id: number;

  @IsOptional()
  @IsString()
  numero_factura_proveedor?: string;

  @IsNumber()
  subtotal: number;

  @IsNumber()
  impuestos: number;

  @IsNumber()
  total: number;

  @IsInt()
  metodo_pago_id: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDetalleCompraDto)
  detalles: CreateDetalleCompraDto[];
}
