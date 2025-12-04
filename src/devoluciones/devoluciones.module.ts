// src/devoluciones/devoluciones.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DevolucionesService } from './devoluciones.service';
import { DevolucionesController } from './devoluciones.controller';
import { DevolucionVenta } from './entities/devolucion.entity';
import { DetalleDevolucion } from '../detalle-devoluciones/entities/detalle-devolucion.entity';
import { Producto } from '../productos/entities/producto.entity';
import { Venta } from '../ventas/entities/venta.entity';
import { SesionCaja } from '../sesiones-caja/entities/sesion-caja.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DevolucionVenta,
      DetalleDevolucion,
      Producto,
      Venta,
      SesionCaja,
    ]),
  ],
  controllers: [DevolucionesController],
  providers: [DevolucionesService],
})
export class DevolucionesModule {}
