import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsNumber,
} from 'class-validator';

export class CreateProductoDto {
  @IsOptional()
  @IsString()
  codigo_barras?: string;

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsInt()
  tipo_item_id: number;

  @IsInt()
  categoria_id: number;

  @IsOptional()
  @IsInt()
  proveedor_id_preferido?: number;

  @IsOptional()
  @IsNumber()
  precio_costo_unitario?: number;

  @IsString()
  @IsNotEmpty()
  unidad_medida: string;

  @IsOptional()
  @IsString()
  registro_ica?: string;

  @IsOptional()
  @IsNumber()
  stock_actual?: number;

  @IsOptional()
  @IsNumber()
  stock_minimo?: number;
}
