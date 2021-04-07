import { EgCacheModule } from '@eg-app/cache/eg-cache.module';
import { I18nLangCacheInterceptor } from '@eg-app/cache/eg-i18n-lang-cache.interceptor';
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { FacadeModule } from '../../facade/facade.module';
import { BotanicalNodeController } from './botanical-node/botanical-node.controller';
import { GrowingManualController } from './growing-manual/growing-manual.controller';
import { MixedCultureController } from './mixed-culture/mixed-culture.controller';

@Module({
  imports: [FacadeModule, EgCacheModule],
  controllers: [BotanicalNodeController, GrowingManualController, MixedCultureController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: I18nLangCacheInterceptor,
    },
  ],
})
export class EdibleGardenRestApiModule {}
