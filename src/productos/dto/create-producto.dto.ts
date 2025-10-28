import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsNumber,
} from 'class-validator';

export class CreateProductoDto {
  @ApiProperty({
    required: false,
    description: 'Código de barras del producto',
    example: '1234567890123',
  })
  @IsOptional()
  @IsString()
  codigo_barras?: string;

  @ApiProperty({
    required: true,
    description: 'Nombre comercial del producto',
    example: 'Fertilizante A',
  })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({
    required: false,
    description: 'Descripción del producto',
    example: 'Fertilizante granular para uso agrícola',
  })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({
    required: true,
    description: 'ID del tipo de ítem al que pertenece el producto',
    example: 1,
  })
  @IsInt()
  tipo_item_id: number;

  @ApiProperty({
    required: true,
    description: 'ID de la categoría del producto',
    example: 2,
  })
  @IsInt()
  categoria_id: number;

  @ApiProperty({
    required: false,
    description: 'ID del proveedor preferido',
    example: 5,
  })
  @IsOptional()
  @IsInt()
  proveedor_id_preferido?: number;

  @ApiProperty({
    required: false,
    description: 'Precio de costo unitario',
    example: 12000.5,
  })
  @IsOptional()
  @IsNumber()
  precio_costo_unitario?: number;

  @ApiProperty({
    required: true,
    description: 'Unidad de medida del producto',
    example: 'kg',
  })
  @IsString()
  @IsNotEmpty()
  unidad_medida: string;

  @ApiProperty({
    required: false,
    description: 'Registro ICA si aplica',
    example: 'ICA-12345',
  })
  @IsOptional()
  @IsString()
  registro_ica?: string;

  @ApiProperty({
    required: false,
    description: 'Cantidad en stock actual',
    example: 100,
  })
  @IsOptional()
  @IsNumber()
  stock_actual?: number;

  @ApiProperty({
    required: false,
    description: 'Stock mínimo antes de generar alerta',
    example: 10,
  })
  @IsOptional()
  @IsNumber()
  stock_minimo?: number;
}
