import appConfig from '@eg-app-config/app.config';
import { BotanicalFamily } from '@eg-domain/botanical-family/botanical-family';
import { BotanicalSpecies } from '@eg-domain/botanical-species/botanical-species';
import { DtoMapper } from '@eg-presentation-facade/shared/mapper/dto-mapper.interface';
import { EntityInfoMapper } from '@eg-presentation-facade/shared/mapper/entity-info.mapper';
import { EntityMapper } from '@eg-presentation-facade/shared/mapper/entity-mapper.interface';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { BotanicalSpeciesDto } from 'src/presentation/facade/botanical-species/dto/botanical-species.dto';

import { CreateBotanicalSpeciesDto } from '../dto/create-botanical-species.dto';

@Injectable()
export class BotanicalSpeciesMapper
  implements
    EntityMapper<CreateBotanicalSpeciesDto, BotanicalSpecies>,
    DtoMapper<BotanicalSpeciesDto, BotanicalSpecies> {
  public constructor(
    @Inject(appConfig.KEY)
    private appConfigProvider: ConfigType<typeof appConfig>,
    private entityInfoMapper: EntityInfoMapper
  ) {}

  public toEntity(dto: CreateBotanicalSpeciesDto): Partial<BotanicalSpecies> {
    const entity: Partial<BotanicalSpecies> = {
      botanicalName: dto.botanicalName ?? undefined,
      botanicalFamily: BotanicalFamily[dto.botanicalFamily] ?? undefined,
    };

    if (dto.i18nNames) {
      const importedLocales = <string[]>this.appConfigProvider.importedLocales();
      entity.addOrUpdateI18nNames(importedLocales, dto.i18nNames);
    }
    return entity;
  }

  public toDto(entity: BotanicalSpecies): BotanicalSpeciesDto {
    const dto = new BotanicalSpeciesDto();
    dto.botanicalName = entity.botanicalName ?? undefined;
    dto.botanicalFamily = BotanicalFamily[entity.botanicalFamily] ?? undefined;
    dto.edibleParts = entity.edibleParts ?? undefined;
    dto.nutritionDemand = entity.nutritionDemand ?? undefined;

    if (entity.entityInfo) {
      dto.entityInfo = this.entityInfoMapper.toDto(entity.entityInfo);
    }

    if (entity.i18nData) {
      dto.i18nNames = {};
      entity.i18nData.forEach((i18nData) => {
        dto.i18nNames[i18nData.languageCode] = i18nData.name;
      });
    }
    return dto;
  }
}
