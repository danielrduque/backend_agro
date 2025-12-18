import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Prefijo global para la API
  app.setGlobalPrefix('api');

  // ----------------------------------------------------
  // 👇 Configuración de CORS para permitir Angular (dev y docker)
  // ----------------------------------------------------
  app.enableCors({
    origin: [
      'http://localhost:4200',     // Frontend dev local
      'http://localhost',          // Frontend Docker HTTP
      'https://localhost',         // Frontend Docker HTTPS
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Configuración de Pipes globales para validación
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Interceptor para serialización de clases (respetar @Exclude, etc.)
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Backend Agro API')
    .setDescription('Documentación de la API para el proyecto Agro')
    .setVersion('1.0')
    .addBearerAuth() // Para autenticación JWT en Swagger UI
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // La UI estará en /api

  // Iniciar la aplicación (0.0.0.0 necesario para Docker)
  const port = process.env.PORT ?? 3001;
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
