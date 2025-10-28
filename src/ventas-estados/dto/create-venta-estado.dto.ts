import { IsString, IsNotEmpty } from 'class-validator';

export class CreateVentaEstadoDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;
}
