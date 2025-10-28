import { IsInt, IsNumber, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGastoDto {
  @ApiProperty({ required: true })
  @IsInt()
  usuario_id: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  sesion_caja_id?: number;

  @ApiProperty({ required: true })
  @IsInt()
  categoria_gasto_id: number;

  @ApiProperty({ required: true })
  @IsInt()
  metodo_pago_id: number;

  @ApiProperty({ required: true })
  @IsNumber()
  monto: number;

  @ApiProperty({ required: true })
  @IsString()
  descripcion: string;
}
