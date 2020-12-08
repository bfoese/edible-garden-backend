import { BotanicalFamily } from '@eg-botanical-species/domain/botanical-family.enum';
import { BotanicalSpeciesDto } from '@eg-botanical-species/dto/botanical-species.dto';
import { CreateBotanicalSpeciesDto } from '@eg-botanical-species/dto/create-botanical-species.dto';
import { BotanicalSpeciesEntity } from '@eg-botanical-species/entity/botanical-species.entity';
import { DtoMapper } from '@eg-data-access/core/mapper/dto-mapper.interface';
import { EntityInfoMapper } from '@eg-data-access/core/mapper/entity-info.mapper';
import { EntityMapper } from '@eg-data-access/core/mapper/entity-mapper.interface';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import appConfig from 'src/config/app.config';

@Injectable()
export class BotanicalSpeciesMapper
  implements
    EntityMapper<CreateBotanicalSpeciesDto, BotanicalSpeciesEntity>,
    DtoMapper<BotanicalSpeciesDto, BotanicalSpeciesEntity> {
  public constructor(
    @Inject(appConfig.KEY)
    private appConfigProvider: ConfigType<typeof appConfig>,
    private entityInfoMapper: EntityInfoMapper
  ) {}

  public toEntity(dto: CreateBotanicalSpeciesDto): Partial<BotanicalSpeciesEntity> {
    const entity: Partial<BotanicalSpeciesEntity> = {
      botanicalName: dto.botanicalName ?? undefined,
      botanicalFamily: BotanicalFamily[dto.botanicalFamily] ?? undefined,
    };

    if (dto.i18nNames) {
      const importedLocales = <string[]>this.appConfigProvider.importedLocales();
      entity.addOrUpdateI18nNames(importedLocales, dto.i18nNames);
    }
    return entity;
  }

  public toDto(entity: BotanicalSpeciesEntity): Partial<BotanicalSpeciesDto> {
    const dto: Partial<BotanicalSpeciesDto> = {
      botanicalName: entity.botanicalName ?? undefined,
      botanicalFamily: BotanicalFamily[entity.botanicalFamily] ?? undefined,
      edibleParts: entity.edibleParts ?? undefined,
      nutritionDemand: entity.nutritionDemand ?? undefined,
    };
    Object.keys(dto).forEach((key) => dto[key] === undefined && delete dto[key]);

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
