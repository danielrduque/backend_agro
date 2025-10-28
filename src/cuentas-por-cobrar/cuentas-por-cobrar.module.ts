// src/cuentas-por-cobrar/cuentas-por-cobrar.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CuentasPorCobrarController } from './cuentas-por-cobrar.controller';
import { CuentasPorCobrarService } from './cuentas-por-cobrar.service';
import { CuentaPorCobrar } from './entities/cuenta-por-cobrar.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CuentaPorCobrar])],
  controllers: [CuentasPorCobrarController],
  providers: [CuentasPorCobrarService],
})
export class CuentasPorCobrarModule {}
