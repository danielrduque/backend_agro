// src/abonos-clientes/abonos-clientes.controller.ts
import { Controller, Post, Body, Get } from '@nestjs/common';
import { AbonosClientesService } from './abonos-clientes.service';
import { CreateAbonoClienteDto } from './dto/create-abono-cliente.dto';

@Controller('abonos-clientes')
export class AbonosClientesController {
  constructor(private readonly abonosService: AbonosClientesService) {}

  @Post()
  create(@Body() createAbonoDto: CreateAbonoClienteDto) {
    return this.abonosService.create(createAbonoDto);
  }

  @Get()
  findAll() {
    return this.abonosService.findAll();
  }
}
