import {
  IsInt,
  IsNumber,
  IsOptional,
  IsArray,
  ValidateNested,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDetalleCotizacionDto {
  @ApiProperty({ required: true })
  @IsInt()
  producto_id: number;

  @ApiProperty({ required: true })
  @IsNumber()
  cantidad: number;

  @ApiProperty({ required: true })
  @IsNumber()
  precio_unitario: number;

  @ApiProperty({ required: true })
  @IsNumber()
  total_linea: number;
}

export class CreateCotizacionDto {
  @ApiProperty({ required: true })
  @IsInt()
  cliente_id: number;

  @ApiProperty({ required: true })
  @IsInt()
  usuario_id: number;

  @ApiProperty({ required: true })
  @IsInt()
  estado_id: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  fecha_vencimiento?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  total?: number;

  @ApiProperty({ required: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDetalleCotizacionDto)
  detalles: CreateDetalleCotizacionDto[];
}
