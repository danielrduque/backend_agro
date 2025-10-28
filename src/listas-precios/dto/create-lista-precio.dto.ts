import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateListaPrecioDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;
}
