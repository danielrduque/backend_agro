// src/compras/compras.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ComprasService } from './compras.service';
import { CreateCompraDto } from './dto/create-compra.dto';

@Controller('compras')
export class ComprasController {
  constructor(private readonly comprasService: ComprasService) {}

  /**
   * @description Crea un nuevo registro de compra y actualiza el stock de los productos.
   * @param createCompraDto Datos de la compra.
   */
  @Post()
  create(@Body() createCompraDto: CreateCompraDto) {
    return this.comprasService.create(createCompraDto);
  }

  /**
   * @description Obtiene una lista de todas las compras.
   */
  @Get()
  findAll() {
    return this.comprasService.findAll();
  }

  /**
   * @description Busca una compra específica por su ID.
   * @param id El ID de la compra.
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.comprasService.findOne(id);
  }
}
