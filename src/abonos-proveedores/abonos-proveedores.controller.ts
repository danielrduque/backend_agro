// src/abonos-proveedores/abonos-proveedores.controller.ts
import { Controller, Post, Body, Get } from '@nestjs/common';
import { AbonosProveedoresService } from './abonos-proveedores.service';
import { CreateAbonoProveedorDto } from './dto/create-abono-proveedor.dto';

@Controller('abonos-proveedores')
export class AbonosProveedoresController {
  constructor(private readonly abonosService: AbonosProveedoresService) {}

  @Post()
  create(@Body() createAbonoDto: CreateAbonoProveedorDto) {
    return this.abonosService.create(createAbonoDto);
  }

  @Get()
  findAll() {
    return this.abonosService.findAll();
  }
}
