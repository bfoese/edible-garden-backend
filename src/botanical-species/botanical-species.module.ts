import { CoreModule } from '@eg-core/core.module';
import { DataAccessModule } from '@eg-data-access/data-access.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BotanicalSpeciesController } from './controller/botanical-species.controller';
import { BotanicalSpeciesI18nEntity } from './entity/botanical-species-i18n.entity';
import { BotanicalSpeciesEntity } from './entity/botanical-species.entity';
import { BotanicalSpeciesMapper } from './mapper/botanical-species.mapper';
import { BotanicalSpeciesService } from './service/botanical-species.service';

@Module({
  imports: [
    CoreModule,
    TypeOrmModule.forFeature([BotanicalSpeciesEntity, BotanicalSpeciesI18nEntity]),
    DataAccessModule,
  ],
  providers: [BotanicalSpeciesService, BotanicalSpeciesMapper],
  controllers: [BotanicalSpeciesController],
})
export class BotanicalSpeciesModule {}
