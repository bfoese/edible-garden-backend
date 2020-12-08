import { DataAccessModule } from '@eg-data-access/data-access.module';
import { Module } from '@nestjs/common';
import { TypesApiModule } from 'src/types-api/types-api.module';
import { BotanicalFamilyController } from './botanical-family/botanical-family.controller';

@Module({
  imports: [TypesApiModule, DataAccessModule],
  controllers: [BotanicalFamilyController],
})
export class RestApiModule {}
