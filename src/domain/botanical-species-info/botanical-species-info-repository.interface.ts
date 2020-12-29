import { BotanicalSpeciesInfo } from './botanical-species-info';

export interface BotanicalSpeciesInfoRepository {
  findOne(id: string): Promise<BotanicalSpeciesInfo>;
  findAll(): Promise<BotanicalSpeciesInfo[]>;
}
