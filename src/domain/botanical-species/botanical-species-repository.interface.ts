import { BotanicalSpecies } from './botanical-species';

export interface BotanicalSpeciesRepository {
  findOne(id: string): Promise<BotanicalSpecies>;
  findAll(): Promise<BotanicalSpecies[]>;
}
