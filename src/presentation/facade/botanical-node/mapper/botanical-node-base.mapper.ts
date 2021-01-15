import { DtoMapper } from '@eg-core/facade/mapper/contract/dto-mapper.interface';
import { EntityInfoMapper } from '@eg-core/facade/mapper/entity-info.mapper';
import { BotanicalNode } from '@eg-domain/botanical-node/botanical-node';
import { Injectable } from '@nestjs/common';

import { BotanicalNodeBaseDto } from '../dto/botanical-node-base.dto';
import { TaxonomicRankMapper } from './taxonomix-rank.mapper';

@Injectable()
export class BotanicalNodeBaseMapper implements DtoMapper<BotanicalNodeBaseDto, BotanicalNode> {
  public constructor(
    // @Inject(appConfig.KEY)
    // private appConfigProvider: ConfigType<typeof appConfig>,
    private entityInfoMapper: EntityInfoMapper,
    private taxonomicRankMapper: TaxonomicRankMapper
  ) {}

  public toDto(entity: BotanicalNode): BotanicalNodeBaseDto {
    if (!entity) {
      return undefined;
    }
    const dto = new BotanicalNodeBaseDto();
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

    dto.taxonomicRank = this.taxonomicRankMapper.toDtoString(entity.taxonomicRank);
    return dto;
  }
}
