// src/abonos-proveedores/abonos-proveedores.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AbonosProveedoresController } from './abonos-proveedores.controller';
import { AbonosProveedoresService } from './abonos-proveedores.service';
import { AbonoProveedor } from './entities/abono-proveedor.entity';
import { CuentaPorPagar } from '../cuentas-por-pagar/entities/cuenta-por-pagar.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AbonoProveedor, CuentaPorPagar])],
  controllers: [AbonosProveedoresController],
  providers: [AbonosProveedoresService],
})
export class AbonosProveedoresModule {}
