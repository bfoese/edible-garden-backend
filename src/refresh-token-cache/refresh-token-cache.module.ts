import redisConfig from '@eg-app-config/redis.config';
import { CacheModule, CacheModuleAsyncOptions, Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';

import { RefreshTokenCacheService } from './refresh-token-cache.service';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [redisConfig.KEY],
      useFactory: (_redisConfig: ConfigType<typeof redisConfig>) => {
        // possible options: https://github.com/NodeRedis/node-redis
        return {
          store: redisStore,
          url: _redisConfig.url // TODO maybe use different database for the tokens?
        } as CacheModuleAsyncOptions;
      },

    }),
  ],
  providers: [RefreshTokenCacheService],
  exports: [RefreshTokenCacheService],
})
export class RefreshTokenCacheModule {}
