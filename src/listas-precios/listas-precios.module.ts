import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListasPreciosService } from './listas-precios.service';
import { ListasPreciosController } from './listas-precios.controller';
import { ListaPrecio } from './entities/lista-precio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ListaPrecio])],
  controllers: [ListasPreciosController],
  providers: [ListasPreciosService],
  exports: [ListasPreciosService], // Exportamos por si otros módulos lo necesitan
})
export class ListasPreciosModule {}
