// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Prefijo global para todas las rutas
  app.setGlobalPrefix('api');

  // Habilitar validaciones globales y transformación automática de datos
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Configuración de Swagger para la documentación de la API
  const config = new DocumentBuilder()
    .setTitle('backend_agro API')
    .setDescription('Documentación de la API para el proyecto backend_agro')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3001);
}

bootstrap();
