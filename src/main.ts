import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { DomainExceptionFilter } from './contexts/shared/filters/domain-exception.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { join } from 'path';
import * as express from 'express';

import { ResponseMappingInterceptor } from './contexts/shared/interceptors/response-mapping.interceptor';
import { Reflector } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: "http://localhost:5173",
    credentials: true,
  });

  app.use(helmet());
  app.use(morgan('combined'));
  app.use(cookieParser());

  // Global Validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true
  }));

  // Global Exception Filter
  app.useGlobalFilters(new DomainExceptionFilter());

  // Global Response Interceptor
  app.useGlobalInterceptors(new ResponseMappingInterceptor(new Reflector()));

  app.setGlobalPrefix('api');

  // Servir carpeta pública de imágenes
  app.use('/uploads', express.static(join(__dirname, '..', 'public/uploads')));

  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Tienda Lite API')
      .setDescription('API docs')
      .setVersion('1.0')
      .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'jwt')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();