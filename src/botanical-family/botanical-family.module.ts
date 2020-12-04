import { BotanicalFamilyController } from '@eg-botanical-family/controller/botanical-family.controller';
import { BotanicalFamilyI18nEntity } from '@eg-botanical-family/entity/botanical-family-i18n.entity';
import { BotanicalFamilyEntity } from '@eg-botanical-family/entity/botanical-family.entity';
import { BotanicalFamilyService } from '@eg-botanical-family/service/botanical-family.service';
import { CoreModule } from '@eg-core/core.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [CoreModule, TypeOrmModule.forFeature([BotanicalFamilyEntity, BotanicalFamilyI18nEntity])],
  controllers: [BotanicalFamilyController],
  providers: [BotanicalFamilyService],
})
export class BotanicalFamilyModule {}
