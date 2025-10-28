import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientesModule } from './clientes/clientes.module';
import { ProductosModule } from './productos/productos.module';
import { VentasModule } from './ventas/ventas.module';
import { ComprasModule } from './compras/compras.module';
import { SesionesCajaModule } from './sesiones-caja/sesiones-caja.module';
import { GastosModule } from './gastos/gastos.module';
import { CuentasPorCobrarModule } from './cuentas-por-cobrar/cuentas-por-cobrar.module'; // <--- AÑADE ESTA LÍNEA
import { AbonosClientesModule } from './abonos-clientes/abonos-clientes.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        // Aquí está la corrección
        port: parseInt(config.get('DB_PORT') || '5432', 10),
        username: config.get('DB_USER'),
        password: config.get('DB_PASS'),
        database: config.get('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: config.get('TYPEORM_SYNCHRONIZE') === 'true',
        logging: config.get('TYPEORM_LOGGING') === 'true',
      }),
    }),
    ClientesModule,
    ProductosModule,
    VentasModule,
    ComprasModule,
    SesionesCajaModule,
    GastosModule,
    CuentasPorCobrarModule,
    AbonosClientesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
