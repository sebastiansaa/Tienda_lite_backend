import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as morgan from 'morgan';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { DomainExceptionFilter } from './contexts/shared/filters/domain-exception.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // security
  app.use(helmet());

  // logging
  app.use(morgan('combined'));

  // cookie parser
  app.use(cookieParser());

  // validation + transformation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Domain -> HTTP mapping
  app.useGlobalFilters(new DomainExceptionFilter());

  app.setGlobalPrefix('api');

  // enable swagger in non-production
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
