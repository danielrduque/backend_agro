// src/reportes/reportes.controller.ts
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportesService } from './reportes.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiQuery } from '@nestjs/swagger';

@Controller('reportes')
@UseGuards(AuthGuard('jwt'))
export class ReportesController {
  constructor(private readonly reportesService: ReportesService) {}

  @Get('ventas')
  @ApiQuery({ name: 'periodo', enum: ['dia', 'semana', 'mes'] })
  getVentas(@Query('periodo') periodo: 'dia' | 'semana' | 'mes') {
    // Si no envían periodo, por defecto 'dia'
    return this.reportesService.getReporteVentas(periodo || 'dia');
  }

  @Get('ganancias')
  @ApiQuery({ name: 'periodo', enum: ['dia', 'semana', 'mes'] })
  getGanancias(@Query('periodo') periodo: 'dia' | 'semana' | 'mes') {
    return this.reportesService.getReporteGanancias(periodo || 'dia');
  }

  @Get('dashboard')
  async getDashboard() {
    // Un endpoint "todo en uno" para la pantalla principal
    const [ventasHoy, gananciaHoy] = await Promise.all([
      this.reportesService.getReporteVentas('dia'),
      this.reportesService.getReporteGanancias('dia'),
    ]);

    return {
      resumen_hoy: {
        ventas: ventasHoy.total_vendido,
        transacciones: ventasHoy.cantidad_ventas,
        ganancia: gananciaHoy.ganancia_neta,
        margen: gananciaHoy.margen_rentabilidad,
      },
    };
  }
}
