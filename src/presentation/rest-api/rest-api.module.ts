import { Module } from '@nestjs/common';
import { FacadeModule } from '../facade/facade.module';
import { BotanicalNodeController } from './botanical-node/botanical-node.controller';
import { GrowingManualController } from './growing-manual/growing-manual.controller';
import { MixedCultureController } from './mixed-culture/mixed-culture.controller';

@Module({
  imports: [FacadeModule],
  controllers: [BotanicalNodeController, GrowingManualController, MixedCultureController],
})
export class RestApiModule {}
