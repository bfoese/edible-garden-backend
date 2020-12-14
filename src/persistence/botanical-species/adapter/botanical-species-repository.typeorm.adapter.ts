import { BotanicalSpecies } from '@eg-domain/botanical-species/botanical-species';
import { BotanicalSpeciesRepository } from '@eg-domain/botanical-species/botanical-species-repository.interface';
import { Injectable } from '@nestjs/common';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UpdateResult } from 'typeorm';
import { BotanicalSpeciesTypeOrmRepository } from '../repository/botanical-species.typeorm-repository';

@Injectable()
export class BotanicalSpeciesRepositoryTypeOrmAdapter implements BotanicalSpeciesRepository {
  public constructor(private readonly botanicalSpeciesRepository: BotanicalSpeciesTypeOrmRepository) {}

  public create(entity: Partial<BotanicalSpecies>): Observable<BotanicalSpecies> {
    return from(this.botanicalSpeciesRepository.save(entity));
  }
  public save(entity: Partial<BotanicalSpecies>): Observable<BotanicalSpecies> {
    return from(this.botanicalSpeciesRepository.save(entity));
  }
  public findOne(id: string): Observable<BotanicalSpecies> {
    return from(this.botanicalSpeciesRepository.findOneOrFail(id));
  }
  public findAll(): Observable<BotanicalSpecies[]> {
    return from(this.botanicalSpeciesRepository.find());
  }
  public delete(id: string): Observable<boolean> {
    return from(this.botanicalSpeciesRepository.delete(id)).pipe(map((result: UpdateResult) => result?.affected > 0));
  }
  public softDelete(id: string): Observable<boolean> {
    return from(this.botanicalSpeciesRepository.softDelete(id)).pipe(
      map((result: UpdateResult) => result?.affected > 0)
    );
  }
  public recover(id: string): Observable<boolean> {
    return from(this.botanicalSpeciesRepository.restore(id)).pipe(map((result: UpdateResult) => result?.affected > 0));
  }
}
