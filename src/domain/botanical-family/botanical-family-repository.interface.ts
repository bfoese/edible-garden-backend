import { BotanicalFamily } from './botanical-family';

export interface BotanicalFamilyRepository {
  findOne(id: string): Promise<BotanicalFamily>;
  findAll(): Promise<BotanicalFamily[]>;
}
