import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMetodoPagoDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  es_efectivo?: boolean;
}
