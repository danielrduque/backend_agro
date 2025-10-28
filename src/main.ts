import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('backend_agro API')
    .setDescription('API documentation for the backend_agro project')
    .setVersion('1.0')
    .build();

  try {
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
    console.log('Swagger UI is running on /api/docs');
  } catch (error) {
    console.error('Swagger setup failed', error);
    // Este bloque de código es un fallback en caso de que Swagger no pueda escanear todos los módulos.
    // Intenta crear el documento solo con los módulos que tienen controladores explícitos.
    console.log(
      'Attempting to generate Swagger doc with a safe subset of modules...',
    );
    try {
      const appContainer = (app as any).container;
      const modules = [...appContainer.getModules().values()];

      const safeModules = modules.filter(
        (module) =>
          module &&
          typeof module.getRoutes === 'function' &&
          module.getRoutes().size > 0,
      );
      const includableModules = safeModules.map((module) => module.metatype);

      const partialDocument = SwaggerModule.createDocument(app, config, {
        include: includableModules,
      });

      SwaggerModule.setup('api/docs', app, partialDocument);
      console.log(
        `Swagger UI is running on /api/docs with ${includableModules.length} modules.`,
      );
    } catch (fallbackError) {
      console.error('Fallback Swagger setup also failed', fallbackError);
    }
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Prefijo global
  app.setGlobalPrefix('api');

  // Pipe de validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Configurar Swagger
  await setupSwagger(app);

  await app.listen(process.env.PORT ?? 3001);
}

bootstrap();
