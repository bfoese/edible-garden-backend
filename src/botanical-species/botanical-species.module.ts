import { CoreModule } from '@eg-core/core.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BotanicalSpeciesI18nEntity } from './entity/botanical-species-i18n.entity';
import { BotanicalSpeciesEntity } from './entity/botanical-species.entity';

@Module({
  imports: [CoreModule, TypeOrmModule.forFeature([BotanicalSpeciesEntity, BotanicalSpeciesI18nEntity])],
})
export class BotanicalSpeciesModule {}
