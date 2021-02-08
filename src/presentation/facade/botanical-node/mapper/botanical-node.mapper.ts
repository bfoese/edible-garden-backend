import { DtoMapper } from '@eg-core/facade/mapper/contract/dto-mapper.interface';
import { OntoEntityMapper } from '@eg-core/facade/mapper/contract/onto-entity-mapper.interface';
import { EntityInfoMapper } from '@eg-core/facade/mapper/entity-info.mapper';
import { BotanicalNode } from '@eg-domain/botanical-node/botanical-node';
import { BotanicalNodeDto } from '@eg-presentation-facade/botanical-node/dto/botanical-node.dto';
import { Injectable } from '@nestjs/common';

import { BotanicalNodeBaseMapper } from './botanical-node-base.mapper';

@Injectable()
export class BotanicalNodeMapper
  implements DtoMapper<BotanicalNodeDto, BotanicalNode>, OntoEntityMapper<BotanicalNodeDto, BotanicalNode> {
  public constructor(
    private botanicalNodeBaseMapper: BotanicalNodeBaseMapper,
    private entityInfoMapper: EntityInfoMapper
  ) {}

  public toDto(entity: BotanicalNode): BotanicalNodeDto {
    if (!entity) {
      return undefined;
    }
    const dto = <BotanicalNodeDto>{
      ...this.botanicalNodeBaseMapper.toDto(entity),
    };

    dto.parent = this.toDto(entity.parent);
    return dto;
  }

  public ontoEntity(dto: BotanicalNodeDto, entity: BotanicalNode): BotanicalNode {
    if (!entity) {
      entity = new BotanicalNode();
      entity.entityInfo = this.entityInfoMapper.ontoEntity(dto.entityInfo, entity.entityInfo);
    }
    return entity;
  }
}
