import { E2EModule } from '@eg-app/e2e/e2e.module';
import { LoggerService } from '@eg-app/logger/logger.service';
import { AuthModule } from '@eg-auth/auth.module';
import { EdibleGardenRestApiModule } from '@eg-rest-api/edible-garden/edible-garden-rest-api.module';
import { SeedSharingRestApiModule } from '@eg-rest-api/seed-sharing/seed-sharing-rest-api.module';
import {
  INestApplication,
  NestApplicationOptions,
  ValidationPipe,
} from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { HttpsOptions } from '@nestjs/common/interfaces/external/https-options.interface';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import * as path from 'path';

import { AppModule } from './app.module';

import dotenvFlow = require('dotenv-flow');
import dotenvExpand = require('dotenv-expand');
import RateLimit = require('express-rate-limit');
import fs = require('fs');
import cookieParser = require('cookie-parser');
async function bootstrap(): Promise<void> {
  initEnvironmenVariables();

  const httpsOptions = getHttpsOptions();
  const app: INestApplication = await NestFactory.create(AppModule, {
    httpsOptions,
    logger: new LoggerService(),
  } as NestApplicationOptions);

  // this is needed to be able to define class-validators with service dependencies
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.use(cookieParser(process.env.BFEG_COOKIE_SIGNATURE_SECRET)); // needed for JWT refresh token

  const corsOriginProperty = process.env.BFEG_CORS_ORIGINS ?? '';
  const corsOrigins = corsOriginProperty ? corsOriginProperty.split('|') : [];
  if (corsOrigins.length > 0) {
    app.enableCors(<CorsOptions>{
      origin: corsOrigins,
      credentials: true,
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

function initEnvironmenVariables(): void {
  const environment = dotenvFlow.config({
    purge_dotenv: true,
  });
  // dotenvExpand will resolve variables within the env files - example:
  // BASE_URL=http://${IP}:${PORT}/
  dotenvExpand(environment);
}

function getHttpsOptions(): HttpsOptions {
  // enable HTTPS under localhost
  const ssl = process.env.BFEG_SSL_ENABLED;
  if (ssl) {
    const keyPath = process.env.BFEG_SSL_KEY_PATH || '';
    const certPath = process.env.BFEG_SSL_CERT_PATH || '';
    return {
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      key: fs.readFileSync(path.join(__dirname, keyPath)),
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      cert: fs.readFileSync(path.join(__dirname, certPath)),
    };
  }
  return null;
}

/**
 * Generates and exposes the Swagger documentation
 * @param app -
 * @param configService -
 */
function initSwagger(app: INestApplication): void {
  SwaggerModule.setup(
    'api',
    app,
    SwaggerModule.createDocument(
      app,

      new DocumentBuilder().setTitle('Edible Garden API').setDescription('').setVersion('1.0').build(),
      {
        include: [AuthModule, SeedSharingRestApiModule, EdibleGardenRestApiModule],
      }
    )
  );

  if (process.env.NODE_ENV !== 'production') {
    SwaggerModule.setup(
      'api/e2e',
      app,
      SwaggerModule.createDocument(
        app,

        new DocumentBuilder().setTitle('Edible Garden E2E API').setDescription('').setVersion('1.0').build(),
        {
          include: [E2EModule],
        }
      )
    );
  }
}

bootstrap();
