// src/devoluciones/devoluciones.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { DevolucionesService } from './devoluciones.service';
import { CreateDevolucionDto } from './dto/create-devolucion.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('devoluciones')
@UseGuards(AuthGuard('jwt')) // Protegemos todo el controlador
export class DevolucionesController {
  constructor(private readonly devolucionesService: DevolucionesService) {}

  @Post()
  create(@Body() createDevolucionDto: CreateDevolucionDto) {
    return this.devolucionesService.create(createDevolucionDto);
  }

  @Get()
  findAll() {
    return this.devolucionesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.devolucionesService.findOne(id);
  }
}
