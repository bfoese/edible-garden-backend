import { BotanicalFamily } from '@eg-domain/botanical-family/botanical-family';
import { BotanicalFamilyRepository } from '@eg-domain/botanical-family/botanical-family-repository.interface';
import { Injectable } from '@nestjs/common';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UpdateResult } from 'typeorm';
import { BotanicalFamilyTypeOrmRepository } from '../repository/botanical-family.typeorm-repository';

@Injectable()
export class BotanicalFamilyRepositoryTypeOrmAdapter implements BotanicalFamilyRepository {
  public constructor(private readonly botanicalFamilyRepository: BotanicalFamilyTypeOrmRepository) {}

  public create(entity: Partial<BotanicalFamily>): Observable<BotanicalFamily> {
    return from(this.botanicalFamilyRepository.save(entity));
  }
  public save(entity: Partial<BotanicalFamily>): Observable<BotanicalFamily> {
    return from(this.botanicalFamilyRepository.save(entity));
  }
  public findOne(id: string): Observable<BotanicalFamily> {
    return from(this.botanicalFamilyRepository.findOneOrFail(id));
  }
  public findAll(): Observable<BotanicalFamily[]> {
    return from(this.botanicalFamilyRepository.find());
  }
  public delete(id: string): Observable<boolean> {
    return from(this.botanicalFamilyRepository.delete(id)).pipe(map((result: UpdateResult) => result?.affected > 0));
  }
  public softDelete(id: string): Observable<boolean> {
    return from(this.botanicalFamilyRepository.softDelete(id)).pipe(
      map((result: UpdateResult) => result?.affected > 0)
    );
  }
  public recover(id: string): Observable<boolean> {
    return from(this.botanicalFamilyRepository.restore(id)).pipe(map((result: UpdateResult) => result?.affected > 0));
  }
}
