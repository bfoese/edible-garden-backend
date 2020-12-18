import { BotanicalSpecies } from '@eg-domain/botanical-species/botanical-species';
import { BotanicalSpeciesRepository } from '@eg-domain/botanical-species/botanical-species-repository.interface';
import { Injectable } from '@nestjs/common';

import { BotanicalSpeciesTypeOrmRepository } from '../repository/botanical-species.typeorm-repository';

@Injectable()
export class BotanicalSpeciesRepositoryTypeOrmAdapter implements BotanicalSpeciesRepository {
  public constructor(private readonly botanicalSpeciesRepository: BotanicalSpeciesTypeOrmRepository) {}

  public findOne(id: string): Promise<BotanicalSpecies> {
    return this.botanicalSpeciesRepository.findOneOrFail(id);
  }
  public findAll(): Promise<BotanicalSpecies[]> {
    return this.botanicalSpeciesRepository.find();
  }
}
