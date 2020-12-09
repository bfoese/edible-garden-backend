import { DataAccessModule } from '@eg-data-access/data-access.module';
import { RestApiTypesModule } from '@eg-rest-api-types/rest-api-types.module';
import { Module } from '@nestjs/common';
import { BotanicalFamilyController } from './botanical-family/botanical-family.controller';

@Module({
  imports: [RestApiTypesModule, DataAccessModule],
  controllers: [BotanicalFamilyController],
})
export class RestApiModule {}
