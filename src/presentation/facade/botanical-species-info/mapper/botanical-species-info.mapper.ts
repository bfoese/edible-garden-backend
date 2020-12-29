import { BotanicalSpeciesInfo } from '@eg-domain/botanical-species-info/botanical-species-info';
import { BotanicalNodeMapper } from '@eg-presentation-facade/botanical-node/mapper/botanical-node.mapper';
import { BotanicalSpeciesInfoDto } from '@eg-presentation-facade/botanical-species-info/dto/botanical-species-info.dto';
import { DtoMapper } from '@eg-presentation-facade/shared/mapper/dto-mapper.interface';
import { EntityInfoMapper } from '@eg-presentation-facade/shared/mapper/entity-info.mapper';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BotanicalSpeciesInfoMapper implements DtoMapper<BotanicalSpeciesInfoDto, BotanicalSpeciesInfo> {
  public constructor(
    // @Inject(appConfig.KEY)
    // private appConfigProvider: ConfigType<typeof appConfig>,
    private entityInfoMapper: EntityInfoMapper,
    private botanicalNodeMapper: BotanicalNodeMapper
  ) {}

  public toDto(entity: BotanicalSpeciesInfo): BotanicalSpeciesInfoDto {
    const dto = new BotanicalSpeciesInfoDto();

    dto.botanicalSpecies = this.botanicalNodeMapper.toDto(entity.botanicalSpecies);
    dto.edibleParts = entity.edibleParts ?? undefined;
    dto.nutritionDemand = entity.nutritionDemand ?? undefined;

    if (entity.entityInfo) {
      dto.entityInfo = this.entityInfoMapper.toDto(entity.entityInfo);
    }

    if (entity.i18nData) {
      dto.i18nNames = {};
      // entity.i18nData.forEach((i18nData) => {
      //   dto.i18nNames[i18nData.languageCode] = i18nData.name;
      // });
    }
    return dto;
  }
}
