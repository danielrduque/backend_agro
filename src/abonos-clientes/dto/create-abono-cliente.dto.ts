import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAbonoClienteDto {
  @IsInt()
  cuenta_cobrar_id: number;

  @IsOptional()
  @IsInt()
  sesion_caja_id?: number;

  @IsInt()
  metodo_pago_id: number;

  @IsNumber()
  monto: number;

  @IsOptional()
  @IsString()
  fecha_abono?: string;
}
