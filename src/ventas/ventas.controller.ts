// src/ventas/ventas.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { VentasService } from './ventas.service';
import { CreateVentaDto } from './dto/create-venta.dto';

@Controller('ventas')
export class VentasController {
  constructor(private readonly ventasService: VentasService) {}

  @UseGuards(AuthGuard('jwt')) // Ahora TypeScript sabe qué es "AuthGuard"
  @Post()
  create(@Request() req, @Body() createVentaDto: CreateVentaDto) {
    // Y también "Request"
    return this.ventasService.create(createVentaDto, req.user);
  }

  @Get()
  findAll() {
    return this.ventasService.findAll();
  }

  @Get(':id/receipt')
  getVentaReceipt(@Param('id', ParseIntPipe) id: number) {
    return this.ventasService.getVentaReceipt(id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ventasService.findOne(id);
  }
}
