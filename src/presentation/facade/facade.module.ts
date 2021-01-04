import { DataAccessModule } from '@eg-data-access/data-access.module';
import { Module } from '@nestjs/common';
import { BotanicalNodeFacadeService } from './botanical-node/botanical-node-facade.service';
import { BotanicalNodeMapper } from './botanical-node/mapper/botanical-node.mapper';
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
    BotanicalNodeMapper,
    GrowingManualMapper,
    MixedCultureMapper,
    EntityInfoMapper,
  ],
  exports: [BotanicalNodeFacadeService, GrowingManualFacadeService, MixedCultureFacadeService],
})
export class FacadeModule {}
