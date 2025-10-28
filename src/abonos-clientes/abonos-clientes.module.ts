// src/abonos-clientes/abonos-clientes.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AbonosClientesController } from './abonos-clientes.controller';
import { AbonosClientesService } from './abonos-clientes.service';
import { AbonoCliente } from './entities/abono-cliente.entity';
import { CuentaPorCobrar } from '../cuentas-por-cobrar/entities/cuenta-por-cobrar.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AbonoCliente, CuentaPorCobrar])],
  controllers: [AbonosClientesController],
  providers: [AbonosClientesService],
})
export class AbonosClientesModule {}
