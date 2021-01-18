import { INestApplication, ValidationPipe } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { HttpsOptions } from '@nestjs/common/interfaces/external/https-options.interface';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as path from 'path';

import { AppModule } from './app.module';

import dotenvFlow = require('dotenv-flow');
import RateLimit = require('express-rate-limit');
import fs = require('fs');
import cookieParser = require('cookie-parser');
async function bootstrap(): Promise<void> {
  dotenvFlow.config({
    purge_dotenv: true,
  });

  // enable HTTPS under localhost
  let httpsOptions: HttpsOptions;
  const ssl = process.env.BFEG_SSL;
  if (ssl) {
    const keyPath = process.env.BFEG_SSL_KEY_PATH || '';
    const certPath = process.env.BFEG_SSL_CERT_PATH || '';
    httpsOptions = {
      key: fs.readFileSync(path.join(__dirname, keyPath)),
      cert: fs.readFileSync(path.join(__dirname, certPath)),
    };
  }

  const app: INestApplication = await NestFactory.create(AppModule, {
    httpsOptions,
  });

  app.use(cookieParser(process.env.BFEG_COOKIE_SIGNATURE_SECRET)); // needed for JWT refresh token

  const corsOriginProperty = process.env.BFEG_CORS_ORIGINS ?? '';
  const corsOrigins = corsOriginProperty ? corsOriginProperty.split('|') : [];
  if (corsOrigins.length > 0) {
    app.enableCors(<CorsOptions>{
      origin: corsOrigins,
    });
  }

  app.setGlobalPrefix('edible-garden');

  app.useGlobalPipes(new ValidationPipe());

  app.use(
    RateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      message: 'We detected unusually high traffic from your IP. Your address will be blocked for 15 minutes.',
    })
  );

  if (process.env.BFEG_SWAGGER_ENABLED === 'true') {
    initSwagger(app);
  }
  await app.listen(process.env.PORT || 8);
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
