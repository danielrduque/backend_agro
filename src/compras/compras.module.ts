// src/compras/compras.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComprasController } from './compras.controller';
import { ComprasService } from './compras.service';
import { Compra } from './entities/compra.entity';
import { DetalleCompra } from '../detalle-compras/entities/detalle-compra.entity';
import { Producto } from '../productos/entities/producto.entity';
import { Proveedor } from '../proveedores/entities/proveedor.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { MetodoPago } from '../metodos-pago/entities/metodo-pago.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Compra,
      DetalleCompra,
      Producto,
      Proveedor,
      Usuario,
      MetodoPago,
    ]),
  ],
  controllers: [ComprasController],
  providers: [ComprasService],
})
export class ComprasModule {}
