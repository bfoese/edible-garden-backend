import { BotanicalSpecies } from '@eg-domain/botanical-species/botanical-species';
import { BotanicalSpeciesRepository } from '@eg-domain/botanical-species/botanical-species-repository.interface';
import { Inject, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const BotanicalSpeciesRepo = () => Inject('BotanicalSpeciesRepositoryTypeOrm');

@Injectable()
export class BotanicalSpeciesService {
  public constructor(@BotanicalSpeciesRepo() private readonly botanicalSpeciesRepository: BotanicalSpeciesRepository) {}

  public findAll(): Observable<BotanicalSpecies[]> {
    return this.botanicalSpeciesRepository.findAll();
  }

  public findOne(id: string): Observable<Partial<BotanicalSpecies>> {
    return this.botanicalSpeciesRepository.findOne(id);
  }
}
