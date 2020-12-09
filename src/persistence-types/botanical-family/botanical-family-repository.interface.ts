import { Observable } from 'rxjs';
import { BotanicalFamilyEntity } from './botanical-family-entity.interface';

export interface BotanicalFamilyRepository {
  create(entity: Partial<BotanicalFamilyEntity>): Observable<BotanicalFamilyEntity>;
  save(entity: Partial<BotanicalFamilyEntity>): Observable<BotanicalFamilyEntity>;

  findOne(id: string): Observable<BotanicalFamilyEntity>;
  findAll(): Observable<BotanicalFamilyEntity[]>;
  delete(id: string): Observable<boolean>;
  softDelete(id: string): Observable<boolean>;
  recover(id: string): Observable<boolean>;
}
