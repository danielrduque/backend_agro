// src/reportes/reportes.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportesService } from './reportes.service';
import { ReportesController } from './reportes.controller';
import { Venta } from '../ventas/entities/venta.entity';
import { DetalleVenta } from '../detalle-ventas/entities/detalle-venta.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Venta, DetalleVenta])],
  controllers: [ReportesController],
  providers: [ReportesService],
})
export class ReportesModule {}
