// src/cotizaciones/cotizaciones.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CotizacionesService } from './cotizaciones.service';
import { CotizacionesController } from './cotizaciones.controller';
import { Cotizacion } from './entities/cotizacion.entity';
import { DetalleCotizacion } from '../detalle-cotizaciones/entities/detalle-cotizacion.entity';
import { Producto } from '../productos/entities/producto.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cotizacion, DetalleCotizacion, Producto]),
  ],
  controllers: [CotizacionesController],
  providers: [CotizacionesService],
})
export class CotizacionesModule {}
