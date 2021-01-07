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
import { EntityInfoMapper } from './shared/mapper/entity-info.mapper';

@Module({
  imports: [DataAccessModule],
  providers: [
    BotanicalNodeFacadeService,
    GrowingManualFacadeService,
    MixedCultureFacadeService,
    BotanicalNodeBaseMapper,
    BotanicalNodeMapper,
    BotanicalTreeNodeMapper,
    GrowingManualMapper,
    MixedCultureMapper,
    EntityInfoMapper,
    TaxonomicRankMapper,
  ],
  exports: [BotanicalNodeFacadeService, GrowingManualFacadeService, MixedCultureFacadeService],
})
export class FacadeModule {}
