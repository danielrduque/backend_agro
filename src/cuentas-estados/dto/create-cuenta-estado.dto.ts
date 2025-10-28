import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCuentaEstadoDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  nombre: string;
}
