import { Module } from '@nestjs/common';

import { FacadeModule } from '../../facade/facade.module';
import { SeedSharingAccountResolver } from './seed-sharing-account/seed-sharing-account.resolver';

@Module({
  imports: [FacadeModule],
  providers: [SeedSharingAccountResolver],
})
export class SeedSharingGraphqlModule {}
