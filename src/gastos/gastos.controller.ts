// src/gastos/gastos.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { GastosService } from './gastos.service';
import { CreateGastoDto } from './dto/create-gasto.dto';

@Controller('gastos')
export class GastosController {
  constructor(private readonly gastosService: GastosService) {}

  /**
   * @description Registra un nuevo gasto en el sistema.
   * @param createGastoDto Datos para el nuevo gasto.
   */
  @Post()
  create(@Body() createGastoDto: CreateGastoDto) {
    return this.gastosService.create(createGastoDto);
  }

  /**
   * @description Obtiene una lista de todos los gastos registrados.
   */
  @Get()
  findAll() {
    return this.gastosService.findAll();
  }

  /**
   * @description Busca un gasto específico por su ID.
   * @param id El ID del gasto a buscar.
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.gastosService.findOne(id);
  }
}
