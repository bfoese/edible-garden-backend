import { TaxonomicRank } from '@eg-domain-constants/taxonomic-rank.enum';
import { BotanicalNode } from '@eg-domain/botanical-node/botanical-node';
import { BotanicalNodeDto } from '@eg-presentation-facade/botanical-node/dto/botanical-node.dto';
import { DtoMapper } from '@eg-presentation-facade/shared/mapper/dto-mapper.interface';
import { EntityInfoMapper } from '@eg-presentation-facade/shared/mapper/entity-info.mapper';
import { Injectable } from '@nestjs/common';
import { TaxonomicRankDto } from '../dto/taxonomic-rank.dto';

@Injectable()
export class BotanicalNodeMapper implements DtoMapper<BotanicalNodeDto, BotanicalNode> {
  public constructor(
    // @Inject(appConfig.KEY)
    // private appConfigProvider: ConfigType<typeof appConfig>,
    private entityInfoMapper: EntityInfoMapper
  ) {}

  public toDto(entity: BotanicalNode): BotanicalNodeDto {
    if (!entity) {
      return undefined;
    }
    const dto = new BotanicalNodeDto();
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

    dto.taxonomicRank = this.rankToDto(entity.taxonomicRank);
    dto.parent = this.toDto(entity.parent);
    return dto;
  }

  public rankToDto(entity: TaxonomicRank): TaxonomicRankDto {
    if (entity) {
      switch (entity) {
        case TaxonomicRank.family:
          return TaxonomicRankDto.BotanicalFamily;
        case TaxonomicRank.species:
          return TaxonomicRankDto.BotanicalSpecies;
      }
    }
    return undefined;
  }
}
