import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { ClientesModule } from '../clientes/clientes.module';
import { ProductosModule } from '../productos/productos.module';
import { ProveedoresModule } from '../proveedores/proveedores.module';

@Module({
  imports: [
    UsuariosModule,
    ClientesModule,
    ProductosModule,
    ProveedoresModule,
  ],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
