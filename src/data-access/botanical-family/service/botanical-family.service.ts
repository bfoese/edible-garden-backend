/* eslint-disable @typescript-eslint/no-unused-vars */
import { BotanicalFamily } from '@eg-domain/botanical-family/botanical-family';
import { BotanicalFamilyRepository } from '@eg-domain/botanical-family/botanical-family-repository.interface';
import { Inject, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const BotanicalFamilyRepo = () => Inject('BotanicalFamilyRepositoryTypeOrm');

@Injectable()
export class BotanicalFamilyService {
  public constructor(@BotanicalFamilyRepo() private readonly botanicalFamilyRepository: BotanicalFamilyRepository) {}

  public findAll(): Observable<BotanicalFamily[]> {
    console.log('find all', this.botanicalFamilyRepository);
    return this.botanicalFamilyRepository.findAll();
  }

  public findOne(id: string): Observable<BotanicalFamily> {
    return this.botanicalFamilyRepository.findOne(id);
  }
}
