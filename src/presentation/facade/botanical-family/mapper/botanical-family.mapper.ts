import { BotanicalFamily } from '@eg-domain/botanical-family/botanical-family';
import { DtoMapper } from '@eg-presentation-facade/shared/mapper/dto-mapper.interface';
import { EntityInfoMapper } from '@eg-presentation-facade/shared/mapper/entity-info.mapper';
import { EntityMapper } from '@eg-presentation-facade/shared/mapper/entity-mapper.interface';
import { Injectable } from '@nestjs/common';
import { BotanicalFamilyDto } from 'src/presentation/facade/botanical-family/dto/botanical-family.dto';

import { CreateBotanicalFamilyDto } from '../dto/create-botanical-family.dto';

@Injectable()
export class BotanicalFamilyMapper
  implements EntityMapper<CreateBotanicalFamilyDto, BotanicalFamily>, DtoMapper<BotanicalFamilyDto, BotanicalFamily> {
  public constructor(
    // @Inject(appConfig.KEY)
    // private appConfigProvider: ConfigType<typeof appConfig>,
    private entityInfoMapper: EntityInfoMapper
  ) {}

  public toEntity(dto: CreateBotanicalFamilyDto): Partial<BotanicalFamily> {
    const entity: Partial<BotanicalFamily> = {
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

  public toDto(entity: BotanicalFamily): BotanicalFamilyDto {
    const dto = new BotanicalFamilyDto();
    dto.botanicalName = entity.botanicalName ?? undefined;

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
