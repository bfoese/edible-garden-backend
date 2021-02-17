import { Module } from '@nestjs/common';

import { FacadeModule } from '../../facade/facade.module';
import { SeedSharingAccountController } from './seed-sharing-account/seed-sharing-account.controller';
import { SeedSharingOfferController } from './seed-sharing-offer/seed-sharing-offer.controller';

@Module({
  imports: [FacadeModule],
  controllers: [SeedSharingOfferController, SeedSharingAccountController],
})
export class SeedSharingRestApiModule {}
