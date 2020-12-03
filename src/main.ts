import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

import dotenvFlow = require('dotenv-flow');

async function bootstrap() {
  dotenvFlow.config({
    purge_dotenv: true,
  });

  const env = process.env.NODE_ENV;
  const app: INestApplication = await NestFactory.create(AppModule);
  app.setGlobalPrefix('edible-garden');

  if (env !== 'production') {
    initSwagger(app);
  }
  const serverPort = process.env.SERVER_PORT;

  await app.listen(serverPort);
}

/**
 * Generates and exposes the Swagger documentation
 * @param app
 * @param configService
 */
function initSwagger(app: INestApplication) {
  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('App API')
      .setDescription('My App API')
      .setVersion('1.0')
      .build(),
  );
  SwaggerModule.setup('api', app, document);
}

bootstrap();
