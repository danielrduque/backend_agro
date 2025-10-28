// src/cuentas-por-cobrar/cuentas-por-cobrar.controller.ts
import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { CuentasPorCobrarService } from './cuentas-por-cobrar.service';

@Controller('cuentas-por-cobrar')
export class CuentasPorCobrarController {
  constructor(
    private readonly cuentasPorCobrarService: CuentasPorCobrarService,
  ) {}

  @Get()
  findAll() {
    return this.cuentasPorCobrarService.findAll();
  }

  @Get('pendientes')
  findPendientes() {
    return this.cuentasPorCobrarService.findPendientes();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cuentasPorCobrarService.findOne(id);
  }
}
