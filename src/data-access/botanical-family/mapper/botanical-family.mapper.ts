import { DtoMapper } from '@eg-data-access/core/mapper/dto-mapper.interface';
import { EntityInfoMapper } from '@eg-data-access/core/mapper/entity-info.mapper';
import { EntityMapper } from '@eg-data-access/core/mapper/entity-mapper.interface';
import { Injectable } from '@nestjs/common';
import { BotanicalFamilyDto } from 'src/types-api/botanical-family/botanical-family.dto';
import { CreateBotanicalFamilyDto } from 'src/types-api/botanical-family/create-botanical-family.dto';
import { BotanicalFamilyEntity } from 'src/types-persistence/botanical-family/botanical-family-entity.interface';

@Injectable()
export class BotanicalFamilyMapper
  implements
    EntityMapper<CreateBotanicalFamilyDto, BotanicalFamilyEntity>,
    DtoMapper<BotanicalFamilyDto, BotanicalFamilyEntity> {
  public constructor(
    // @Inject(appConfig.KEY)
    // private appConfigProvider: ConfigType<typeof appConfig>,
    private entityInfoMapper: EntityInfoMapper
  ) {}

  public toEntity(dto: CreateBotanicalFamilyDto): Partial<BotanicalFamilyEntity> {
    const entity: Partial<BotanicalFamilyEntity> = {
      botanicalName: dto.botanicalName ?? undefined,
    };

    // TODO
    if (dto.i18nNames) {
      entity.i18nData = [];
    }
    // if (dto.i18nNames) {
    //   const importedLocales = <string[]>this.appConfigProvider.importedLocales();
    //   entity.addOrUpdateI18nNames(importedLocales, dto.i18nNames);
    // }
    return entity;
  }

  public toDto(entity: BotanicalFamilyEntity): Partial<BotanicalFamilyDto> {
    const dto: Partial<BotanicalFamilyDto> = {
      botanicalName: entity.botanicalName ?? undefined,
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
