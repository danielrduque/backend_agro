// src/sesiones-caja/sesiones-caja.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SesionesCajaController } from './sesiones-caja.controller';
import { SesionesCajaService } from './sesiones-caja.service';
import { SesionCaja } from './entities/sesion-caja.entity';
import { Venta } from '../ventas/entities/venta.entity';
import { AbonoCliente } from '../abonos-clientes/entities/abono-cliente.entity';
import { Gasto } from '../gastos/entities/gasto.entity';
import { AbonoProveedor } from '../abonos-proveedores/entities/abono-proveedor.entity';
import { Caja } from '../cajas/entities/caja.entity';
import { SesionCajaEstado } from '../sesiones-caja-estados/entities/sesion-caja-estado.entity';
import { MetodoPago } from '../metodos-pago/entities/metodo-pago.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SesionCaja,
      Caja,
      SesionCajaEstado,
      Venta,
      AbonoCliente,
      Gasto,
      AbonoProveedor,
      MetodoPago,
    ]),
  ],
  controllers: [SesionesCajaController],
  providers: [SesionesCajaService],
})
export class SesionesCajaModule {}
