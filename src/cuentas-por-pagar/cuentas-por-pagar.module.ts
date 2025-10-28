// src/cuentas-por-pagar/cuentas-por-pagar.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CuentasPorPagarController } from './cuentas-por-pagar.controller';
import { CuentasPorPagarService } from './cuentas-por-pagar.service';
import { CuentaPorPagar } from './entities/cuenta-por-pagar.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CuentaPorPagar])],
  controllers: [CuentasPorPagarController],
  providers: [CuentasPorPagarService],
})
export class CuentasPorPagarModule {}
