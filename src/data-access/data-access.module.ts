import { PersistenceModule } from '@eg-persistence/persistence.module';
import { Module } from '@nestjs/common';

import { BotanicalNodeService } from './botanical-node/service/botanical-node.service';
import { GrowingManualService } from './growing-manual/service/growing-manual.service';
import { MixedCultureService } from './mixed-culture/mixed-culture.service';
import { SeedSharingOfferService } from './seed-sharing-offer/service/seed-sharing-offer.service';
import { UserService } from './user/user.service';

@Module({
  imports: [PersistenceModule],
  providers: [BotanicalNodeService, GrowingManualService, MixedCultureService, UserService, SeedSharingOfferService],
  exports: [BotanicalNodeService, GrowingManualService, MixedCultureService, UserService, SeedSharingOfferService],
})
export class DataAccessModule {}
