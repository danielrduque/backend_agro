import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PreciosProductoService } from './precios-producto.service';
import { PreciosProductoController } from './precios-producto.controller';
import { PrecioProducto } from './entities/precio-producto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PrecioProducto])],
  controllers: [PreciosProductoController],
  providers: [PreciosProductoService],
})
export class PreciosProductoModule {}
