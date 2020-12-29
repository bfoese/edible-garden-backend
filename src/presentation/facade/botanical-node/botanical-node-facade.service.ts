import { BotanicalNodeService } from '@eg-data-access/botanical-node/service/botanical-node.service';
import { BotanicalNode } from '@eg-domain/botanical-node/botanical-node';
import { BotanicalNodeDto } from '@eg-presentation-facade/botanical-node/dto/botanical-node.dto';
import { Injectable } from '@nestjs/common';
import { BotanicalNodeMapper } from './mapper/botanical-node.mapper';

@Injectable()
export class BotanicalNodeFacadeService {
  public constructor(
    private botanicalNodeService: BotanicalNodeService,
    private readonly botanicalNodeMapper: BotanicalNodeMapper
  ) {}

  public findOne(id: string): Promise<BotanicalNodeDto> {
    return this.botanicalNodeService
      .findOne(id)
      .then((entity: BotanicalNode) => this.botanicalNodeMapper.toDto(entity));
  }

  public findAll(): Promise<BotanicalNodeDto[]> {
    return this.botanicalNodeService
      .findAll()
      .then((entities: BotanicalNode[]) =>
        entities.map((entity: BotanicalNode) => this.botanicalNodeMapper.toDto(entity))
      );
  }
}
