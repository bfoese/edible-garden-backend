import { GrowingManual } from '@eg-domain/growing-manual/growing-manual';
import { NutritionDemand } from '@eg-domain/growing-manual/nutrition-demand';
import { BotanicalNodeMapper } from '@eg-presentation-facade/botanical-node/mapper/botanical-node.mapper';
import { GrowingManualDto } from '@eg-presentation-facade/growing-manual/dto/growing-manual.dto';
import { DtoMapper } from '@eg-presentation-facade/shared/mapper/dto-mapper.interface';
import { EntityInfoMapper } from '@eg-presentation-facade/shared/mapper/entity-info.mapper';
import { Injectable } from '@nestjs/common';
import { NutritionDemandDto } from '../dto/nutrition-demand.dto';

@Injectable()
export class GrowingManualMapper implements DtoMapper<GrowingManualDto, GrowingManual> {
  public constructor(
    // @Inject(appConfig.KEY)
    // private appConfigProvider: ConfigType<typeof appConfig>,
    private entityInfoMapper: EntityInfoMapper,
    private botanicalNodeMapper: BotanicalNodeMapper
  ) {}

  public toDto(entity: GrowingManual): GrowingManualDto {
    const dto = new GrowingManualDto();

    dto.botanicalNode = this.botanicalNodeMapper.toDto(entity.botanicalNode);
    dto.edibleParts = entity.edibleParts ?? undefined;
    dto.nutritionDemand = this.nutritionDemandToDto(entity.nutritionDemand);

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

  public nutritionDemandToDto(entity: NutritionDemand): NutritionDemandDto {
    if (entity) {
      const dto = new NutritionDemandDto();
      dto.value = entity.value ?? undefined;
      return entity;
    }
    return null;
  }
}
