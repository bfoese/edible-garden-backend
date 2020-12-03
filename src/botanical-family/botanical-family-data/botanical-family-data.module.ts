import { Module } from '@nestjs/common';
import { CoreDataModule } from 'src/core/core-data/core-data.module';
import { BotanicalFamilyEntityRepository } from './repository/botanical-family.repository';

@Module({
  imports: [CoreDataModule],
  providers: [BotanicalFamilyEntityRepository],
  exports: [BotanicalFamilyEntityRepository],
})
export class BotanicalFamilyDataModule {}
