import { PersistenceModule } from '@eg-persistence/persistence.module';
import { Module } from '@nestjs/common';
import { BotanicalFamilyService } from './botanical-family/service/botanical-family.service';
import { BotanicalSpeciesService } from './botanical-species/service/botanical-species.service';

@Module({
  imports: [PersistenceModule],
  providers: [BotanicalFamilyService, BotanicalSpeciesService],
  exports: [BotanicalFamilyService, BotanicalSpeciesService],
})
export class DataAccessModule {}
