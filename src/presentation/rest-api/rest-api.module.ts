import { Module } from '@nestjs/common';
import { FacadeModule } from '../facade/facade.module';
import { BotanicalNodeController } from './botanical-node/botanical-node.controller';
import { BotanicalSpeciesInfoController } from './botanical-species/botanical-species.controller';

@Module({
  imports: [FacadeModule],
  controllers: [BotanicalNodeController, BotanicalSpeciesInfoController],
})
export class RestApiModule {}
