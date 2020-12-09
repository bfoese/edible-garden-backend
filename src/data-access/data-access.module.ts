import { PersistenceModule } from '@eg-peristence/persistence.module';
import { Module } from '@nestjs/common';
import { PersistenceTypesModule } from 'src/persistence-types/persistence-types.module';
import { RestApiTypesModule } from 'src/presentation/rest-api-types/rest-api-types.module';
import { BotanicalFamilyMapper } from './botanical-family/mapper/botanical-family.mapper';
import { BotanicalFamilyService } from './botanical-family/service/botanical-family.service';
import { EntityInfoMapper } from './core/mapper/entity-info.mapper';

@Module({
  imports: [RestApiTypesModule, PersistenceTypesModule, PersistenceModule],
  providers: [BotanicalFamilyService, BotanicalFamilyMapper, EntityInfoMapper],
  exports: [BotanicalFamilyService, EntityInfoMapper],
})
export class DataAccessModule {}
