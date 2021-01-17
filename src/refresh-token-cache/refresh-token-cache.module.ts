import { CacheModule, CacheModuleOptions, Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';

import { RefreshTokenCacheService } from './refresh-token-cache.service';

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: () => {
        return {
          store: redisStore,
          host: 'localhost',
          port: 6379,
        } as CacheModuleOptions;
      },
    }),
  ],
  providers: [RefreshTokenCacheService],
  exports: [RefreshTokenCacheService],
})
export class RefreshTokenCacheModule {}
