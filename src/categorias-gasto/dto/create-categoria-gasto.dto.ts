import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCategoriaGastoDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;
}
