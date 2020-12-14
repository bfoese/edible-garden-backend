import { Module } from '@nestjs/common';
import { FacadeModule } from '../facade/facade.module';
import { BotanicalFamilyController } from './botanical-family/botanical-family.controller';
import { BotanicalSpeciesController } from './botanical-species/botanical-species.controller';

@Module({
  imports: [FacadeModule],
  controllers: [BotanicalFamilyController, BotanicalSpeciesController],
})
export class RestApiModule {}
