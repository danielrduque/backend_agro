import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';
import { REDIS_CLIENT } from './redis.constants';

// Usamos @Global() para que el cliente de Redis esté disponible
// en todos los módulos (como ProductosService) sin tener que importarlo.
@Global()
@Module({
  imports: [ConfigModule], // Necesitamos ConfigModule para leer las variables de entorno
  providers: [
    {
      provide: REDIS_CLIENT, // Este es el "token" que usaremos para inyectar
      useFactory: (configService: ConfigService) => {
        // Obtenemos la configuración de Redis de las variables de entorno
        const host = configService.get<string>('REDIS_HOST', '172.25.196.134');
        const port = configService.get<number>('REDIS_PORT', 6379);

        // Creamos y retornamos la instancia del cliente ioredis
        return new Redis({
          host,
          port,
          maxRetriesPerRequest: null, // Configuración recomendada por ioredis
        });
      },
      inject: [ConfigService], // Inyectamos ConfigService en el factory
    },
  ],
  exports: [REDIS_CLIENT], // Exportamos el token para que otros módulos puedan usarlo
})
export class RedisModule {}
