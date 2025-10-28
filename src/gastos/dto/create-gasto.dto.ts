import { IsInt, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateGastoDto {
  @IsInt()
  usuario_id: number;

  @IsOptional()
  @IsInt()
  sesion_caja_id?: number;

  @IsInt()
  categoria_gasto_id: number;

  @IsInt()
  metodo_pago_id: number;

  @IsNumber()
  monto: number;

  @IsString()
  descripcion: string;
}
