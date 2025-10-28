// src/ventas/ventas.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VentasService } from './ventas.service';
import { VentasController } from './ventas.controller';
import { Venta } from './entities/venta.entity';
import { DetalleVenta } from '../detalle-ventas/entities/detalle-venta.entity';
import { Producto } from '../productos/entities/producto.entity';
import { Cliente } from '../clientes/entities/cliente.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { SesionCaja } from '../sesiones-caja/entities/sesion-caja.entity';
import { MetodoPago } from '../metodos-pago/entities/metodo-pago.entity';
import { VentaEstado } from '../ventas-estados/entities/venta-estado.entity';
import { CuentaPorCobrar } from '../cuentas-por-cobrar/entities/cuenta-por-cobrar.entity';
import { CuentaEstado } from '../cuentas-estados/entities/cuenta-estado.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Venta,
      DetalleVenta,
      Producto,
      Cliente,
      Usuario,
      SesionCaja,
      MetodoPago,
      VentaEstado,
      CuentaPorCobrar,
      CuentaEstado,
    ]),
  ],
  controllers: [VentasController],
  providers: [VentasService],
})
export class VentasModule {}
