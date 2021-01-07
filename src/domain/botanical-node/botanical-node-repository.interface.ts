import { BotanicalNode } from './botanical-node';

export interface BotanicalNodeRepository {
  findOne(id: string): Promise<BotanicalNode>;
  getTree(): Promise<BotanicalNode[]>;
}
