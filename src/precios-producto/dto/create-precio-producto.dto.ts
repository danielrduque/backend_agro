import { IsInt, IsNumber } from 'class-validator';

export class CreatePrecioProductoDto {
  @IsInt()
  producto_id: number;

  @IsInt()
  lista_precio_id: number;

  @IsNumber()
  precio_venta: number;
}
