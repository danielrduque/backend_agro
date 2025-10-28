// src/ventas/dto/update-venta.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateVentaDto } from './create-venta.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateVentaDto extends PartialType(CreateVentaDto) {}
