import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoriaGastoDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  nombre: string;
}
