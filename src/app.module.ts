import appConfig from '@eg-app-config/app.config';
import { RestApiModule } from '@eg-rest-api/rest-api.module';
import { CacheModule, CacheModuleAsyncOptions, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
      load: [appConfig],
    }),
    DomainModule,
    RestApiModule,
    HealthModule,
    AuthModule,
    CacheModule.registerAsync({
      useFactory: () => {
        // possible options: https://github.com/NodeRedis/node-redis
        return {
          store: redisStore,
          url: process.env.BFEG_REDIS_URL
        } as CacheModuleAsyncOptions;
      },

    }),
  ],
  providers: [],
})
export class AppModule {}
