import { Observable } from 'rxjs';
import { BotanicalSpecies } from './botanical-species';

export interface BotanicalSpeciesRepository {
  findOne(id: string): Observable<BotanicalSpecies>;
  findAll(): Observable<BotanicalSpecies[]>;
}
