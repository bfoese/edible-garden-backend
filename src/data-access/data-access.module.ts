import { PersistenceModule } from '@eg-persistence/persistence.module';
import { Module } from '@nestjs/common';
import { BotanicalNodeService } from './botanical-node/service/botanical-node.service';
import { GrowingManualService } from './growing-manual/service/growing-manual.service';
import { MixedCultureService } from './mixed-culture/mixed-culture.service';

@Module({
  imports: [PersistenceModule],
  providers: [BotanicalNodeService, GrowingManualService, MixedCultureService],
  exports: [BotanicalNodeService, GrowingManualService, MixedCultureService],
})
export class DataAccessModule {}
