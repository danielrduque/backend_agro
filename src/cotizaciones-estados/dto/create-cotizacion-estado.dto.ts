import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCotizacionEstadoDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  nombre: string;
}
