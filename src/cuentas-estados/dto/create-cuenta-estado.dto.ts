import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCuentaEstadoDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;
}
