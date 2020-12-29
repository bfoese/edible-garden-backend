import { PersistenceModule } from '@eg-persistence/persistence.module';
import { Module } from '@nestjs/common';
import { BotanicalNodeService } from './botanical-node/service/botanical-node.service';
import { BotanicalSpeciesInfoService } from './botanical-species/service/botanical-species.service';

@Module({
  imports: [PersistenceModule],
  providers: [BotanicalNodeService, BotanicalSpeciesInfoService],
  exports: [BotanicalNodeService, BotanicalSpeciesInfoService],
})
export class DataAccessModule {}
