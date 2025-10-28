// src/cuentas-por-pagar/cuentas-por-pagar.controller.ts
import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { CuentasPorPagarService } from './cuentas-por-pagar.service';

@Controller('cuentas-por-pagar')
export class CuentasPorPagarController {
  constructor(
    private readonly cuentasPorPagarService: CuentasPorPagarService,
  ) {}

  @Get()
  findAll() {
    return this.cuentasPorPagarService.findAll();
  }

  @Get('pendientes')
  findPendientes() {
    return this.cuentasPorPagarService.findPendientes();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cuentasPorPagarService.findOne(id);
  }
}
