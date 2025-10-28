import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCotizacionEstadoDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;
}
