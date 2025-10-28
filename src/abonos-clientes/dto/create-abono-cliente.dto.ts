import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAbonoClienteDto {
  @ApiProperty({ required: true })
  @IsInt()
  cuenta_cobrar_id: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  sesion_caja_id?: number;

  @ApiProperty({ required: true })
  @IsInt()
  metodo_pago_id: number;

  @ApiProperty({ required: true })
  @IsNumber()
  monto: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  fecha_abono?: string;
}
