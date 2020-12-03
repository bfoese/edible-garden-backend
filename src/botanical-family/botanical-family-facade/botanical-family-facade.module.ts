import { Module } from '@nestjs/common';
import { BotanicalFamilyDataModule } from 'src/botanical-family/botanical-family-data/botanical-family-data.module';
import { CoreFacadeModule } from 'src/core/core-facade/core-facade.module';
import { BotanicalFamilyController } from './controller/botanical-family.controller';
import { BotanicalFamilyService } from './service/botanical-family.service';

@Module({
  imports: [CoreFacadeModule, BotanicalFamilyDataModule],
  controllers: [BotanicalFamilyController],
  providers: [BotanicalFamilyService],
  exports: [],
})
export class BotanicalFamilyFacadeModule {}
