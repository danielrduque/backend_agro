import {
  IsInt,
  IsNumber,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDetalleCompraDto {
  @ApiProperty({
    required: true,
    description: 'ID del producto comprado',
    example: 12,
  })
  @IsInt()
  producto_id: number;

  @ApiProperty({
    required: true,
    description: 'Cantidad comprada',
    example: 10,
  })
  @IsNumber()
  cantidad: number;

  @ApiProperty({
    required: true,
    description: 'Precio de costo unitario pagado al proveedor',
    example: 18000,
  })
  @IsNumber()
  precio_costo_unitario: number;

  @ApiProperty({
    required: true,
    description: 'Total de la línea (cantidad * precio unitario)',
    example: 180000,
  })
  @IsNumber()
  total_linea: number;
}

export class CreateCompraDto {
  @ApiProperty({ required: true })
  @IsInt()
  proveedor_id: number;

  @ApiProperty({ required: true })
  @IsInt()
  usuario_id: number;

  @ApiProperty({
    required: false,
    description: 'Número de factura del proveedor',
    example: 'CP-2025-0005',
  })
  @IsOptional()
  @IsString()
  numero_factura_proveedor?: string;

  @ApiProperty({
    required: true,
    description: 'Subtotal de la compra (sin impuestos)',
    example: 150000,
  })
  @IsNumber()
  subtotal: number;

  @ApiProperty({
    required: true,
    description: 'Impuestos en la compra',
    example: 28500,
  })
  @IsNumber()
  impuestos: number;

  @ApiProperty({
    required: true,
    description: 'Total de la compra (subtotal + impuestos)',
    example: 178500,
  })
  @IsNumber()
  total: number;

  @ApiProperty({
    required: true,
    description: 'Método de pago utilizado (ID)',
    example: 1,
  })
  @IsInt()
  metodo_pago_id: number;

  @ApiProperty({
    required: true,
    description: 'Detalles de la compra',
    type: CreateDetalleCompraDto,
    isArray: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDetalleCompraDto)
  detalles: CreateDetalleCompraDto[];
}
