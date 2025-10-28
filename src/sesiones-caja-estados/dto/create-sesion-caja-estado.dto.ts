import { IsString, IsNotEmpty } from 'class-validator';

export class CreateSesionCajaEstadoDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;
}
