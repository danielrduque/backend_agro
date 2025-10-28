// src/productos/productos.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductosService } from './productos.service';
import { ProductosController } from './productos.controller';
import { Producto } from './entities/producto.entity';
// También importamos las entidades relacionadas para que el repositorio las conozca
import { TipoItem } from '../tipos-item/entities/tipo-item.entity';
import { CategoriaProducto } from '../categorias-producto/entities/categoria-producto.entity';
import { Proveedor } from '../proveedores/entities/proveedor.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Producto,
      TipoItem,
      CategoriaProducto,
      Proveedor,
    ]),
  ],
  controllers: [ProductosController],
  providers: [ProductosService],
})
export class ProductosModule {}
