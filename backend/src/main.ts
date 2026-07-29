import express from 'express';
import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './presentation/http/filters/http-exception.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Servir archivos estáticos subidos
  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));

  // 1. Middleware de cookies
  app.use(cookieParser());

  // 2. Configuración de CORS dinámica para cualquier puerto de desarrollo Angular (localhost / 127.0.0.1)
  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = [process.env.FRONTEND_URL].filter(Boolean);
      // Permitir solicitudes sin origin (como Postman o curl) o desde cualquier puerto localhost
      if (
        !origin ||
        /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin) ||
        allowedOrigins.includes(origin)
      ) {
        callback(null, true);
      } else {
        callback(new Error(`CORS bloqueado para el origen: ${origin}`));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'X-Requested-With',
    ],
    exposedHeaders: ['Set-Cookie'],
    credentials: true,
  });

  // 3. Prefijo Global de API (/api)
  app.setGlobalPrefix('api');

  // 4. Pipe de Validación Global (DTS validation)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // 5. Filtro de Excepciones Estandarizado (para Interceptores de Angular)
  app.useGlobalFilters(new HttpExceptionFilter());

  // 6. Documentación interactiva Swagger / OpenAPI (/api/docs)
  const config = new DocumentBuilder()
    .setTitle('Gift Shop E-Commerce API')
    .setDescription(
      'API REST para tienda de ramos, peluches, chocolates y combos. Preparada para integración con Angular.',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Ingresa el Access Token recibido en Login/Registro',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  logger.log(`🚀 Servidor ejecutándose en http://localhost:${port}/api`);
  logger.log(
    `📚 Documentación Swagger lista en http://localhost:${port}/api/docs`,
  );
  logger.log(
    `🌐 CORS habilitado para cliente Angular en http://localhost:4200`,
  );
}

void bootstrap();
