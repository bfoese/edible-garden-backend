import { BotanicalSpecies } from '@eg-domain/botanical-species/botanical-species';
import { BotanicalSpeciesRepository } from '@eg-domain/botanical-species/botanical-species-repository.interface';
import { Inject, Injectable } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const BotanicalSpeciesRepo = () => Inject('BotanicalSpeciesRepositoryTypeOrm');

@Injectable()
export class BotanicalSpeciesService {
  public constructor(@BotanicalSpeciesRepo() private readonly botanicalSpeciesRepository: BotanicalSpeciesRepository) {}

  public findAll(): Promise<BotanicalSpecies[]> {
    return this.botanicalSpeciesRepository.findAll();
  }

  public findOne(id: string): Promise<BotanicalSpecies> {
    return this.botanicalSpeciesRepository.findOne(id);
  }
}
