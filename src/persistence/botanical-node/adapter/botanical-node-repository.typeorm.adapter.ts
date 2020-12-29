import { BotanicalNode } from '@eg-domain/botanical-node/botanical-node';
import { BotanicalNodeRepository } from '@eg-domain/botanical-node/botanical-node-repository.interface';
import { Injectable } from '@nestjs/common';

import { BotanicalNodeTypeOrmRepository } from '../repository/botanical-node.typeorm-repository';

@Injectable()
export class BotanicalNodeRepositoryTypeOrmAdapter implements BotanicalNodeRepository {
  public constructor(private readonly botanicalNodeRepository: BotanicalNodeTypeOrmRepository) {}

  public findOne(id: string): Promise<BotanicalNode> {
    return this.botanicalNodeRepository.findOneOrFail(id);
  }
  public findAll(): Promise<BotanicalNode[]> {
    return this.botanicalNodeRepository.find();
  }
}
