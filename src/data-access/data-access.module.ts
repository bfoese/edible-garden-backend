import { PersistenceModule } from '@eg-peristence/persistence.module';
import { Module } from '@nestjs/common';
import { TypesApiModule } from 'src/types-api/types-api.module';
import { TypesPersistenceModule } from 'src/types-persistence/types-persistence.module';
import { BotanicalFamilyMapper } from './botanical-family/mapper/botanical-family.mapper';
import { BotanicalFamilyService } from './botanical-family/service/botanical-family.service';
import { EntityInfoMapper } from './core/mapper/entity-info.mapper';

@Module({
  imports: [TypesApiModule, TypesPersistenceModule, PersistenceModule],
  providers: [BotanicalFamilyService, BotanicalFamilyMapper, EntityInfoMapper],
  exports: [BotanicalFamilyService, EntityInfoMapper],
})
export class DataAccessModule {}
