import { EgCacheModule } from '@eg-app/cache/eg-cache.module';
import { Module } from '@nestjs/common';

import { RefreshTokenCacheService } from './refresh-token-cache.service';

@Module({
  imports: [
    EgCacheModule,
  ],
  providers: [RefreshTokenCacheService],
  exports: [RefreshTokenCacheService],
})
export class RefreshTokenCacheModule {}
