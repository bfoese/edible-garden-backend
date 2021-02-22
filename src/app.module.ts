import appConfig from '@eg-app-config/app.config';
import authConfig from '@eg-app-config/auth.config';
import dbConfig from '@eg-app-config/db.config';
import emailConfig from '@eg-app-config/email.config';
import redisConfig from '@eg-app-config/redis.config';
import healthConfig from '@eg-app/config/health.config';
import { EgI18nModule } from '@eg-app/i18n/eg-i18n.module';
import { JwtAuthGuard } from '@eg-auth/guards/jwt-auth.guard';
import { EdibleGardenRestApiModule } from '@eg-rest-api/edible-garden/edible-garden-rest-api.module';
import { SeedSharingRestApiModule } from '@eg-rest-api/seed-sharing/seed-sharing-rest-api.module';
import { CacheModule, CacheModuleAsyncOptions, Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import * as redisStore from 'cache-manager-redis-store';

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
    EgI18nModule.forRoot(),
    DomainModule,
    EdibleGardenRestApiModule,
    SeedSharingRestApiModule,
    HealthModule,
    AuthModule,
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [redisConfig.KEY],
      useFactory: (_redisConfig: ConfigType<typeof redisConfig>) => {
        // possible options: https://github.com/NodeRedis/node-redis
        return {
          store: redisStore,
          url: _redisConfig.url,
        } as CacheModuleAsyncOptions;
      },
    }),
    ScheduleModule.forRoot(),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
