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
            } as CacheModuleAsyncOptions;
          },
        }),
      ],
      exports: [
        CacheModule,
        I18nLangCacheInterceptor
      ],
      global: true,
    };
  }
}
