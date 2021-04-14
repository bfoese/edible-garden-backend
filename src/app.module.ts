import appConfig from '@eg-app-config/app.config';
import authConfig from '@eg-app-config/auth.config';
import dbConfig from '@eg-app-config/db.config';
import emailConfig from '@eg-app-config/email.config';
import redisConfig from '@eg-app-config/redis.config';
import { EgCacheModule } from '@eg-app/cache/eg-cache.module';
import healthConfig from '@eg-app/config/health.config';
import { E2EModule } from '@eg-app/e2e/e2e.module';
import { EgI18nModule } from '@eg-app/i18n/eg-i18n.module';
import { JwtAuthGuard } from '@eg-auth/guards/jwt-auth.guard';
import { EdibleGardenRestApiModule } from '@eg-rest-api/edible-garden/edible-garden-rest-api.module';
import { SeedSharingRestApiModule } from '@eg-rest-api/seed-sharing/seed-sharing-rest-api.module';
import { CACHE_MANAGER, Inject, Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { ScheduleModule } from '@nestjs/schedule';

import { HealthModule } from './application/health/health.module';
import { LoggerModule } from './application/logger/logger.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { DomainModule } from './domain/domain.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    MailModule,
    LoggerModule,
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, redisConfig, emailConfig, authConfig, dbConfig, healthConfig],
    }),
    EgCacheModule.forRoot(),
    EgI18nModule.forRoot(),
    DomainModule,
    EdibleGardenRestApiModule,
    SeedSharingRestApiModule,
    HealthModule,
    AuthModule,
    E2EModule,
    ScheduleModule.forRoot(),
    // enable GraphQL caching: https://github.com/nestjs/graphql/issues/443#issuecomment-599445224
    GraphQLModule.forRootAsync({
      imports: [ConfigModule],
      inject: [appConfig.KEY],
      useFactory: async (_appConfig: ConfigType<typeof appConfig>) => ({
        // provide the right context for i18n
        // eslint-disable-next-line @typescript-eslint/ban-types
        context: ({ req, connection }): object => connection ? { req: connection.context } : { req },
        autoSchemaFile: 'edible-garden-schema.gql',
        path: _appConfig.endpointPath(),
        cors: {
          credentials: true,
          origin: true,
        },
        ...(!(_appConfig.isProduction()) && {
          playground: {
            endpoint: 'graphql-play',
            settings: {
              'request.credentials': 'same-origin',
            },
          },
        }),
      }),
    }),
  ],
  providers: [
    { // globally secure endpoints with JwtAuthGuard
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public constructor(@Inject(CACHE_MANAGER) cacheManager: any) {
    // The cache error handler ensures, that the application will startup, even when Redis cache is not available
    const client = cacheManager.store.getClient();
    client.on('error', (error) => {
      console.error(error);
    });
  }
}
