import { DataAccessModule } from '@eg-data-access/data-access.module';
import { Module } from '@nestjs/common';
import { BotanicalFamilyFacadeService } from './botanical-family/botanical-family-facade.service';
import { BotanicalFamilyMapper } from './botanical-family/mapper/botanical-family.mapper';
import { BotanicalSpeciesFacadeService } from './botanical-species/botanical-species-facade.service';
import { BotanicalSpeciesMapper } from './botanical-species/mapper/botanical-species.mapper';
import { EntityInfoMapper } from './shared/mapper/entity-info.mapper';

@Module({
  imports: [DataAccessModule],
  providers: [
    BotanicalFamilyFacadeService,
    BotanicalSpeciesFacadeService,
    BotanicalFamilyMapper,
    BotanicalSpeciesMapper,
    EntityInfoMapper,
  ],
  exports: [BotanicalFamilyFacadeService, BotanicalSpeciesFacadeService],
})
export class FacadeModule {}
