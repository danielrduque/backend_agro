import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientesModule } from './clientes/clientes.module';
import { ProductosModule } from './productos/productos.module';
import { VentasModule } from './ventas/ventas.module';
import { ComprasModule } from './compras/compras.module';
import { SesionesCajaModule } from './sesiones-caja/sesiones-caja.module';
import { GastosModule } from './gastos/gastos.module';
import { CuentasPorCobrarModule } from './cuentas-por-cobrar/cuentas-por-cobrar.module';
import { AbonosClientesModule } from './abonos-clientes/abonos-clientes.module';
import { CuentasPorPagarModule } from './cuentas-por-pagar/cuentas-por-pagar.module';
import { AbonosProveedoresModule } from './abonos-proveedores/abonos-proveedores.module';
import { CajasModule } from './cajas/cajas.module';
import { RolesModule } from './roles/roles.module';
import { MetodosPagoModule } from './metodos-pago/metodos-pago.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from './redis/redis.module';
import { DevolucionesModule } from './devoluciones/devoluciones.module';
import { CotizacionesModule } from './cotizaciones/cotizaciones.module';
import { SeedModule } from './seed/seed.module';
import { ListasPreciosModule } from './listas-precios/listas-precios.module';
import { ReportesModule } from './reportes/reportes.module';
import { ProveedoresModule } from './proveedores/proveedores.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AuditLogModule } from './audit-log/audit-log.module';
import { AuditInterceptor } from './audit-log/audit.interceptor';
import { Neo4jModule } from './neo4j/neo4j.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // PostgreSQL (datos principales)
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: parseInt(config.get('DB_PORT') || '5432', 10),
        username: config.get('DB_USER'),
        password: config.get('DB_PASS'),
        database: config.get('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: config.get('TYPEORM_SYNCHRONIZE') === 'true',
        logging: config.get('TYPEORM_LOGGING') === 'true',
      }),
    }),
    // MongoDB (logs de auditoría)
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get('MONGODB_URI') || 'mongodb://localhost:27017/agro_audit',
      }),
    }),
    RedisModule,
    AuditLogModule,
    ClientesModule,
    ProductosModule,
    VentasModule,
    ComprasModule,
    SesionesCajaModule,
    GastosModule,
    CuentasPorCobrarModule,
    AbonosClientesModule,
    CuentasPorPagarModule,
    AbonosProveedoresModule,
    CajasModule,
    RolesModule,
    MetodosPagoModule,
    UsuariosModule,
    AuthModule,
    DevolucionesModule,
    CotizacionesModule,
    SeedModule,
    ListasPreciosModule,
    ReportesModule,
    ProveedoresModule,
    NotificationsModule,
    Neo4jModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Interceptor global para auditoría automática
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
  ],
})
export class AppModule {}

