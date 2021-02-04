import appConfig from '@eg-app-config/app.config';
import authConfig from '@eg-app-config/auth.config';
import dbConfig from '@eg-app-config/db.config';
import emailConfig from '@eg-app-config/email.config';
import redisConfig from '@eg-app-config/redis.config';
import { RestApiModule } from '@eg-rest-api/rest-api.module';
import { CacheModule, CacheModuleAsyncOptions, Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
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
      load: [appConfig, redisConfig, emailConfig, authConfig, dbConfig],
    }),
    DomainModule,
    RestApiModule,
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
  ],
  providers: [],
})
export class AppModule {}
