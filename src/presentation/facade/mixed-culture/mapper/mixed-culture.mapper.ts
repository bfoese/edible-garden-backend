import { MixedCulture } from '@eg-domain/mixed-culture/mixed-culture';
import { BotanicalNodeMapper } from '@eg-presentation-facade/botanical-node/mapper/botanical-node.mapper';
import { DtoMapper } from '@eg-presentation-facade/shared/mapper/dto-mapper.interface';
import { EntityInfoMapper } from '@eg-presentation-facade/shared/mapper/entity-info.mapper';
import { Injectable } from '@nestjs/common';
import { MixedCultureDto } from '../dto/mixed-culture.dto';

@Injectable()
export class MixedCultureMapper implements DtoMapper<MixedCultureDto, MixedCulture> {
  public constructor(
    // @Inject(appConfig.KEY)
    // private appConfigProvider: ConfigType<typeof appConfig>,
    private entityInfoMapper: EntityInfoMapper,
    private botanicalNodeMapper: BotanicalNodeMapper
  ) {}

  public toDto(entity: MixedCulture): MixedCultureDto {
    const dto = new MixedCultureDto();

    dto.firstCompanion = this.botanicalNodeMapper.toDto(entity.firstCompanion);
    dto.secondCompanion = this.botanicalNodeMapper.toDto(entity.secondCompanion);
    dto.isDisadvantageous = entity.isDisadvantageous ?? undefined;

    if (entity.entityInfo) {
      dto.entityInfo = this.entityInfoMapper.toDto(entity.entityInfo);
    }

    if (entity.i18nData) {
      dto.i18nDescriptions = {};
      entity.i18nData.forEach((i18nData) => {
        dto.i18nDescriptions[i18nData.languageCode] = i18nData.description;
      });
    }
    return dto;
  }
}
