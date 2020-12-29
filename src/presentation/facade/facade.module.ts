import { DataAccessModule } from '@eg-data-access/data-access.module';
import { Module } from '@nestjs/common';
import { BotanicalNodeFacadeService } from './botanical-node/botanical-node-facade.service';
import { BotanicalNodeMapper } from './botanical-node/mapper/botanical-node.mapper';
import { BotanicalSpeciesInfoFacadeService } from './botanical-species-info/botanical-species-info-facade.service';
import { BotanicalSpeciesInfoMapper } from './botanical-species-info/mapper/botanical-species-info.mapper';
import { EntityInfoMapper } from './shared/mapper/entity-info.mapper';

@Module({
  imports: [DataAccessModule],
  providers: [
    BotanicalNodeFacadeService,
    BotanicalSpeciesInfoFacadeService,
    BotanicalNodeMapper,
    BotanicalSpeciesInfoMapper,
    EntityInfoMapper,
  ],
  exports: [BotanicalNodeFacadeService, BotanicalSpeciesInfoFacadeService],
})
export class FacadeModule {}
