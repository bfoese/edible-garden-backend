import { Module } from '@nestjs/common';

import { FacadeModule } from '../../facade/facade.module';
import { SeedSharingOfferController } from './seed-sharing-offer/seed-sharing-offer.controller';

@Module({
  imports: [FacadeModule],
  controllers: [SeedSharingOfferController],
})
export class SeedSharingRestApiModule {}
