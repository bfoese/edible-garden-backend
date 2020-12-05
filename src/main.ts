import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

import dotenvFlow = require('dotenv-flow');
import RateLimit = require('express-rate-limit');

async function bootstrap(): Promise<void> {
  dotenvFlow.config({
    purge_dotenv: true,
  });

  const env = process.env.NODE_ENV;
  const app: INestApplication = await NestFactory.create(AppModule);
  app.setGlobalPrefix('edible-garden');

  app.useGlobalPipes(new ValidationPipe());

  app.use(
    RateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      message: 'We detected unusually high traffic from your IP. Your address will be blocked for 15 minutes.',
    })
  );

  if (env !== 'production') {
    initSwagger(app);
  }
  const serverPort = process.env.SERVER_PORT;

  await app.listen(serverPort);
}

/**
 * Generates and exposes the Swagger documentation
 * @param app -
 * @param configService -
 */
function initSwagger(app: INestApplication): void {
  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder().setTitle('Edible Garden API').setDescription('').setVersion('1.0').build()
  );
  SwaggerModule.setup('api', app, document);
}

bootstrap();
