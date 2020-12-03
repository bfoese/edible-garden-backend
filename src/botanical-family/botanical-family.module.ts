import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoreFacadeModule } from 'src/core/core-facade/core-facade.module';
import { BotanicalFamilyController } from './controller/botanical-family.controller';
import { BotanicalFamilyI18nEntity } from './entity/botanical-family-i18n.entity';
import { BotanicalFamilyEntity } from './entity/botanical-family.entity';
import { BotanicalFamilyService } from './service/botanical-family.service';

@Module({
  imports: [
    CoreFacadeModule,
    TypeOrmModule.forFeature([
      BotanicalFamilyEntity,
      BotanicalFamilyI18nEntity,
    ]),
  ],
  controllers: [BotanicalFamilyController],
  providers: [BotanicalFamilyService],
  exports: [],
})
export class BotanicalFamilyModule {}
