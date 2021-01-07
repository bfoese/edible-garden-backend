import { BotanicalNodeService } from '@eg-data-access/botanical-node/service/botanical-node.service';
import { BotanicalNode } from '@eg-domain/botanical-node/botanical-node';
import { BotanicalNodeDto } from '@eg-presentation-facade/botanical-node/dto/botanical-node.dto';
import { Injectable } from '@nestjs/common';
import { BotanicalTreeNodeDto } from './dto/botanical-tree-node.dto';
import { BotanicalNodeMapper } from './mapper/botanical-node.mapper';
import { BotanicalTreeNodeMapper } from './mapper/botanical-tree-node.mapper';

@Injectable()
export class BotanicalNodeFacadeService {
  public constructor(
    private botanicalNodeService: BotanicalNodeService,
    private readonly botanicalNodeMapper: BotanicalNodeMapper,
    private readonly botanicalTreeNodeMapper: BotanicalTreeNodeMapper
  ) {}

  public findOne(id: string): Promise<BotanicalNodeDto> {
    return this.botanicalNodeService
      .findOne(id)
      .then((entity: BotanicalNode) => this.botanicalNodeMapper.toDto(entity));
  }

  public getTree(): Promise<BotanicalTreeNodeDto[]> {
    return this.botanicalNodeService
      .getTree()
      .then((entities: BotanicalNode[]) =>
        entities.map((entity: BotanicalNode) => this.botanicalTreeNodeMapper.toDto(entity))
      );
  }
}
