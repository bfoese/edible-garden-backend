/* eslint-disable @typescript-eslint/no-unused-vars */
import { BotanicalNode } from '@eg-domain/botanical-node/botanical-node';
import { BotanicalNodeRepository } from '@eg-domain/botanical-node/botanical-node-repository.interface';
import { Inject, Injectable } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const BotanicalNodeRepo = () => Inject('BotanicalNodeRepositoryTypeOrm');

@Injectable()
export class BotanicalNodeService {
  public constructor(@BotanicalNodeRepo() private readonly botanicalNodeRepository: BotanicalNodeRepository) {}

  public getTree(i18nLang: string): Promise<BotanicalNode[]> {
    return this.botanicalNodeRepository.getTree(i18nLang);
  }

  public findOne(id: string): Promise<BotanicalNode> {
    return this.botanicalNodeRepository.findOne(id);
  }
}
