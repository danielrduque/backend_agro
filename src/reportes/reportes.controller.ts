// src/reportes/reportes.controller.ts
import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { ReportesService } from './reportes.service';
import { ExportarService } from './exportar.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venta } from '../ventas/entities/venta.entity';
import { Producto } from '../productos/entities/producto.entity';
import { Cliente } from '../clientes/entities/cliente.entity';

@ApiTags('Reportes')
@Controller('reportes')
@UseGuards(AuthGuard('jwt'))
export class ReportesController {
  constructor(
    private readonly reportesService: ReportesService,
    private readonly exportarService: ExportarService,
    @InjectRepository(Venta)
    private readonly ventaRepo: Repository<Venta>,
    @InjectRepository(Producto)
    private readonly productoRepo: Repository<Producto>,
    @InjectRepository(Cliente)
    private readonly clienteRepo: Repository<Cliente>,
  ) {}

  // =========================================
  // REPORTES JSON (existentes)
  // =========================================

  @Get('ventas')
  @ApiQuery({ name: 'periodo', enum: ['dia', 'semana', 'mes'] })
  getVentas(@Query('periodo') periodo: 'dia' | 'semana' | 'mes') {
    return this.reportesService.getReporteVentas(periodo || 'dia');
  }

  @Get('ganancias')
  @ApiQuery({ name: 'periodo', enum: ['dia', 'semana', 'mes'] })
  getGanancias(@Query('periodo') periodo: 'dia' | 'semana' | 'mes') {
    return this.reportesService.getReporteGanancias(periodo || 'dia');
  }

  @Get('dashboard')
  async getDashboard() {
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

  // =========================================
  // EXPORTACIONES PDF
  // =========================================

  @Get('ventas/pdf')
  @ApiQuery({ name: 'periodo', enum: ['dia', 'semana', 'mes'], required: false })
  async downloadVentasPDF(
    @Query('periodo') periodo: string = 'mes',
    @Res() res: Response,
  ) {
    const ventas = await this.ventaRepo.find({
      relations: ['cliente', 'metodo_pago'],
      order: { fecha_venta: 'DESC' },
      take: 100, // Últimas 100 ventas
    });
    return this.exportarService.generateVentasPDF(ventas, res, periodo);
  }

  @Get('productos/pdf')
  async downloadProductosPDF(@Res() res: Response) {
    const productos = await this.productoRepo.find({
      relations: ['categoria'],
      order: { nombre: 'ASC' },
    });
    return this.exportarService.generateProductosPDF(productos, res);
  }

  @Get('clientes/pdf')
  async downloadClientesPDF(@Res() res: Response) {
    const clientes = await this.clienteRepo.find({
      order: { nombre_completo: 'ASC' },
    });
    return this.exportarService.generateClientesPDF(clientes, res);
  }

  // =========================================
  // EXPORTACIONES EXCEL
  // =========================================

  @Get('ventas/excel')
  @ApiQuery({ name: 'periodo', enum: ['dia', 'semana', 'mes'], required: false })
  async downloadVentasExcel(
    @Query('periodo') periodo: string = 'mes',
    @Res() res: Response,
  ) {
    const ventas = await this.ventaRepo.find({
      relations: ['cliente', 'metodo_pago'],
      order: { fecha_venta: 'DESC' },
      take: 500,
    });
    return this.exportarService.generateVentasExcel(ventas, res, periodo);
  }

  @Get('productos/excel')
  async downloadProductosExcel(@Res() res: Response) {
    const productos = await this.productoRepo.find({
      relations: ['categoria'],
      order: { nombre: 'ASC' },
    });
    return this.exportarService.generateProductosExcel(productos, res);
  }

  @Get('clientes/excel')
  async downloadClientesExcel(@Res() res: Response) {
    const clientes = await this.clienteRepo.find({
      order: { nombre_completo: 'ASC' },
    });
    return this.exportarService.generateClientesExcel(clientes, res);
  }
}
