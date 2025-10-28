import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CuentasPorPagarController } from './cuentas-por-pagar.controller';
import { CuentasPorPagarService } from './cuentas-por-pagar.service';
import { CuentaPorPagar } from './entities/cuenta-por-pagar.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CuentaPorPagar])],
  // --- ¡LÍNEA CLAVE! ---
  controllers: [CuentasPorPagarController],
  providers: [CuentasPorPagarService],
})
export class CuentasPorPagarModule {}
