import { Observable } from 'rxjs';
import { BotanicalFamily } from './botanical-family';

export interface BotanicalFamilyRepository {
  findOne(id: string): Observable<BotanicalFamily>;
  findAll(): Observable<BotanicalFamily[]>;
}
