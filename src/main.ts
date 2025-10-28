import { NestFactory, Reflector } from '@nestjs/core'; // 👈 1. Importa Reflector
import { AppModule } from './app.module';
import {
  INestApplication,
  ValidationPipe,
  ClassSerializerInterceptor, // 👈 2. Importa ClassSerializerInterceptor
} from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('backend_agro API')
    .setDescription('API documentation for the backend_agro project')
    .setVersion('1.0')
    // 👇 **BONUS: Añadí esto para que puedas probar el login desde Swagger**
    .addBearerAuth()
    .build();

  try {
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
    console.log('Swagger UI is running on /api/docs');
  } catch (error) {
    console.error('Swagger setup failed', error);
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

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // 👇 **3. AÑADE ESTAS LÍNEAS**
  // Esto activa el interceptor global para transformar las respuestas
  // y respetar los decoradores como @Exclude().
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  await setupSwagger(app);

  await app.listen(process.env.PORT ?? 3001);
}

bootstrap();
