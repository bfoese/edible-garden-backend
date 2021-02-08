import { CoreFacadeModule } from '@eg-core/facade/core-facade.module';
import { DataAccessModule } from '@eg-data-access/data-access.module';
import { Module } from '@nestjs/common';

import { BotanicalNodeFacadeService } from './botanical-node/botanical-node-facade.service';
import { BotanicalNodeBaseMapper } from './botanical-node/mapper/botanical-node-base.mapper';
import { BotanicalNodeMapper } from './botanical-node/mapper/botanical-node.mapper';
import { BotanicalTreeNodeMapper } from './botanical-node/mapper/botanical-tree-node.mapper';
import { TaxonomicRankMapper } from './botanical-node/mapper/taxonomix-rank.mapper';
import { GrowingManualFacadeService } from './growing-manual/growing-manual-facade.service';
import { GrowingManualMapper } from './growing-manual/mapper/growing-manual.mapper';
import { MixedCultureMapper } from './mixed-culture/mapper/mixed-culture.mapper';
import { MixedCultureFacadeService } from './mixed-culture/mixed-culture-facade.service';
import { AddressMapper } from './seed-sharing-offer/mapper/address.mapper';
import { PhoneNumberMapper } from './seed-sharing-offer/mapper/phone-number.mapper';
import { SeedSharingOfferCreationMapper } from './seed-sharing-offer/mapper/seed-sharing-offer-creation.mapper';
import { SeedSharingOfferMapper } from './seed-sharing-offer/mapper/seed-sharing-offer.mapper';
import { SeedSharingOfferFacadeService } from './seed-sharing-offer/seed-sharing-offer-facade.service';

@Module({
  imports: [DataAccessModule, CoreFacadeModule],
  providers: [
    BotanicalNodeFacadeService,
    GrowingManualFacadeService,
    MixedCultureFacadeService,
    BotanicalNodeBaseMapper,
    BotanicalNodeMapper,
    BotanicalTreeNodeMapper,
    GrowingManualMapper,
    MixedCultureMapper,
    TaxonomicRankMapper,
    SeedSharingOfferFacadeService,
    SeedSharingOfferMapper,
    SeedSharingOfferCreationMapper,
    AddressMapper,
    PhoneNumberMapper,
  ],
  exports: [
    BotanicalNodeFacadeService,
    GrowingManualFacadeService,
    MixedCultureFacadeService,
    SeedSharingOfferFacadeService,
  ],
})
export class FacadeModule {}
