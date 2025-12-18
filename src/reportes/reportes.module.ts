// src/reportes/reportes.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportesService } from './reportes.service';
import { ReportesController } from './reportes.controller';
import { ExportarService } from './exportar.service';
import { Venta } from '../ventas/entities/venta.entity';
import { DetalleVenta } from '../detalle-ventas/entities/detalle-venta.entity';
import { Producto } from '../productos/entities/producto.entity';
import { Cliente } from '../clientes/entities/cliente.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Venta, DetalleVenta, Producto, Cliente])],
  controllers: [ReportesController],
  providers: [ReportesService, ExportarService],
  exports: [ExportarService],
})
export class ReportesModule {}
