import { IsInt, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePrecioProductoDto {
  @ApiProperty({ required: true })
  @IsInt()
  producto_id: number;

  @ApiProperty({ required: true })
  @IsInt()
  lista_precio_id: number;

  @ApiProperty({ required: true })
  @IsNumber()
  precio_venta: number;
}
