import {
  IsInt,
  IsNumber,
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDetalleVentaDto {
  @ApiProperty({ required: true, description: 'ID del producto', example: 12 })
  @IsInt()
  producto_id: number;

  @ApiProperty({
    required: true,
    description: 'Cantidad vendida de este producto',
    example: 3,
  })
  @IsNumber()
  cantidad: number;

  @ApiProperty({
    required: true,
    description: 'Precio unitario de venta',
    example: 25000,
  })
  @IsNumber()
  precio_unitario_venta: number;

  @ApiProperty({
    required: true,
    description: 'Precio de costo usado para calcular margen en la venta',
    example: 20000,
  })
  @IsNumber()
  precio_costo_en_venta: number;

  @ApiProperty({
    required: true,
    description: 'Subtotal de la línea (cantidad * precio_unitario)',
    example: 75000,
  })
  @IsNumber()
  subtotal_linea: number;

  @ApiProperty({
    required: true,
    description: 'Impuestos aplicados a la línea',
    example: 14250,
  })
  @IsNumber()
  impuestos_linea: number;

  @ApiProperty({
    required: true,
    description: 'Total de la línea (subtotal + impuestos)',
    example: 89250,
  })
  @IsNumber()
  total_linea: number;
}

export class CreateVentaDto {
  @ApiProperty({ required: true })
  @IsInt()
  cliente_id: number;

  @ApiProperty({ required: true })
  @IsInt()
  usuario_id: number;

  @ApiProperty({ required: true })
  @IsInt()
  sesion_caja_id: number;

  @ApiProperty({ required: true })
  @IsInt()
  metodo_pago_id: number;

  @ApiProperty({ required: true })
  @IsInt()
  estado_id: number;

  @ApiProperty({
    required: false,
    description: 'Número de factura generado por el sistema (si aplica)',
    example: 'FV-2025-0001',
  })
  @IsOptional()
  @IsString()
  numero_factura?: string;

  @ApiProperty({
    required: true,
    description: 'Subtotal de la venta (sin impuestos)',
    example: 150000,
  })
  @IsNumber()
  subtotal: number;

  @ApiProperty({
    required: true,
    description: 'Total de impuestos de la venta',
    example: 28500,
  })
  @IsNumber()
  impuestos: number;

  @ApiProperty({
    required: true,
    description: 'Total a pagar por la venta (subtotal + impuestos)',
    example: 178500,
  })
  @IsNumber()
  total: number;

  @ApiProperty({
    required: true,
    description: 'Detalles de la venta',
    type: CreateDetalleVentaDto,
    isArray: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDetalleVentaDto)
  detalles: CreateDetalleVentaDto[];
}
