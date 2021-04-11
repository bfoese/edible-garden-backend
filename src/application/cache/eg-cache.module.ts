import redisConfig from '@eg-app/config/redis.config';
import {
  CacheModule,
  CacheModuleAsyncOptions,
  DynamicModule,
  Global,
  Module,
} from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';

import { I18nLangCacheInterceptor } from './eg-i18n-lang-cache.interceptor';

@Global()
@Module({})
export class EgCacheModule {
  public static forRoot(): DynamicModule {
    return {
      module: EgCacheModule,
      imports: [
        I18nLangCacheInterceptor,
        CacheModule.registerAsync({
          imports: [ConfigModule],
          inject: [redisConfig.KEY],
          useFactory: (_redisConfig: ConfigType<typeof redisConfig>) => {
            // possible options: https://github.com/NodeRedis/node-redis
            return {
              store: redisStore,
              url: _redisConfig.url,
              retry_strategy: function (options) {
                if (options.error && options.error.code === 'ECONNREFUSED') {
                  // End reconnecting on a specific error and flush all commands with
                  // a individual error
                  return new Error('The server refused the connection');
                }
                if (options.total_retry_time > 1000 * 60 * 60) {
                  // End reconnecting after a specific timeout and flush all commands
                  // with a individual error
                  return new Error('Retry time exhausted');
                }
                if (options.attempt > 10) {
                  // End reconnecting with built in error
                  return undefined;
                }
                // reconnect after
                return Math.min(options.attempt * 100, 3000);
              },
            } as CacheModuleAsyncOptions;
          },
        }),
      ],
      exports: [CacheModule, I18nLangCacheInterceptor],
      global: true,
    };
  }
}
