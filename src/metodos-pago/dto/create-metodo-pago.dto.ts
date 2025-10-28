import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class CreateMetodoPagoDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsOptional()
  @IsBoolean()
  es_efectivo?: boolean;
}
