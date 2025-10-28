// src/sesiones-caja/dto/create-sesion-caja.dto.ts
import { IsInt, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSesionCajaDto {
  @ApiProperty({
    required: true,
    description: 'ID del usuario que abre la caja',
  })
  @IsInt()
  usuario_id: number;

  @ApiProperty({
    required: true,
    description: 'ID de la caja física que se está abriendo',
  })
  @IsInt()
  caja_id: number;

  @ApiProperty({
    required: true,
    description: 'Monto inicial o base con el que empieza la caja',
  })
  @IsNumber()
  monto_base_inicial: number;
}
