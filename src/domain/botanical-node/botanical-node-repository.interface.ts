import { BotanicalNode } from './botanical-node';

export interface BotanicalNodeRepository {
  findOne(id: string): Promise<BotanicalNode>;
  findAll(): Promise<BotanicalNode[]>;
}
