import { BotanicalNode } from '@eg-domain/botanical-node/botanical-node';
import { BotanicalNodeDto } from '@eg-presentation-facade/botanical-node/dto/botanical-node.dto';
import { DtoMapper } from '@eg-presentation-facade/shared/mapper/dto-mapper.interface';
import { Injectable } from '@nestjs/common';
import { BotanicalNodeBaseMapper } from './botanical-node-base.mapper';

@Injectable()
export class BotanicalNodeMapper implements DtoMapper<BotanicalNodeDto, BotanicalNode> {
  public constructor(private botanicalNodeBaseMapper: BotanicalNodeBaseMapper) {}

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
}
