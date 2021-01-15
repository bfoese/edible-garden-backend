import { ArrayUtil } from '@eg-common/util/array.util';
import { DtoMapper } from '@eg-core/facade/mapper/contract/dto-mapper.interface';
import { BotanicalNode } from '@eg-domain/botanical-node/botanical-node';
import { BotanicalTreeNodeDto } from '@eg-presentation-facade/botanical-node/dto/botanical-tree-node.dto';
import { Injectable } from '@nestjs/common';

import { BotanicalNodeBaseMapper } from './botanical-node-base.mapper';

@Injectable()
export class BotanicalTreeNodeMapper implements DtoMapper<BotanicalTreeNodeDto, BotanicalNode> {
  public constructor(private botanicalNodeBaseMapper: BotanicalNodeBaseMapper) {}

  public toDto(entity: BotanicalNode): BotanicalTreeNodeDto {
    if (!entity) {
      return undefined;
    }
    const dto = <BotanicalTreeNodeDto>{
      ...this.botanicalNodeBaseMapper.toDto(entity),
    };

    if (!ArrayUtil.isEmpty(entity.children)) {
      dto.children = [];
      entity.children.forEach((child: BotanicalNode) => dto.children.push(this.toDto(child)));
    }
    return dto;
  }
}
