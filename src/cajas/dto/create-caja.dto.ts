import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCajaDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsOptional()
  @IsString()
  ubicacion?: string;
}
