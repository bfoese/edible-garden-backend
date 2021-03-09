import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { IsLocaleEnabledValidator } from './validators/is-locale-enabled.validator';
import { IsNotEmptyIfExtAuthProviderValidator } from './validators/is-not-empty-if-ext-auth-provider.validator';

@Module({
  imports: [ConfigModule],
  providers: [IsLocaleEnabledValidator, IsNotEmptyIfExtAuthProviderValidator],
  exports: [],
})
export class ValidationModule {}
