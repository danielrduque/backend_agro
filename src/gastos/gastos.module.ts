import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GastosController } from './gastos.controller';
import { GastosService } from './gastos.service';
import { Gasto } from './entities/gasto.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { CategoriaGasto } from '../categorias-gasto/entities/categoria-gasto.entity';
import { MetodoPago } from '../metodos-pago/entities/metodo-pago.entity';
import { SesionCaja } from '../sesiones-caja/entities/sesion-caja.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Gasto,
      Usuario,
      CategoriaGasto,
      MetodoPago,
      SesionCaja,
    ]),
  ],
  // --- ¡LÍNEA CLAVE! ---
  controllers: [GastosController],
  providers: [GastosService],
})
export class GastosModule {}
