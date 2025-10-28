// src/sesiones-caja/sesiones-caja.controller.ts
import {
  Controller,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Get,
} from '@nestjs/common';
import { SesionesCajaService } from './sesiones-caja.service';
import { CreateSesionCajaDto } from './dto/create-sesion-caja.dto';
import { CerrarSesionCajaDto } from './dto/cerrar-sesion-caja.dto';

@Controller('sesiones-caja')
export class SesionesCajaController {
  constructor(private readonly sesionesCajaService: SesionesCajaService) {}

  @Post('abrir')
  abrirCaja(@Body() createSesionDto: CreateSesionCajaDto) {
    return this.sesionesCajaService.abrirCaja(createSesionDto);
  }

  @Post(':id/cerrar')
  cerrarCaja(
    @Param('id', ParseIntPipe) id: number,
    @Body() cerrarSesionDto: CerrarSesionCajaDto,
  ) {
    return this.sesionesCajaService.cerrarCaja(id, cerrarSesionDto);
  }

  @Get()
  findAll() {
    // Este método necesita ser creado en tu servicio.
    // Si no existe, lo creamos en el siguiente paso.
    return this.sesionesCajaService.findAll();
  }

  @Get('caja/:cajaId/estado')
  obtenerEstadoActual(@Param('cajaId', ParseIntPipe) cajaId: number) {
    return this.sesionesCajaService.obtenerEstadoActual(cajaId);
  }
}
