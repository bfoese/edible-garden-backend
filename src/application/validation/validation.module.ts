import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { IsLocaleEnabled } from './validators/is-locale-enabled.validator';

@Module({
  imports: [ConfigModule],
  providers: [IsLocaleEnabled],
  exports: [],
})
export class ValidationModule {}
