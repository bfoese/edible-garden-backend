import { BotanicalSpeciesService } from '@eg-data-access/botanical-species/service/botanical-species.service';
import { BotanicalSpecies } from '@eg-domain/botanical-species/botanical-species';
import { Injectable } from '@nestjs/common';
import { BotanicalSpeciesDto } from 'src/presentation/facade/botanical-species/dto/botanical-species.dto';

import { BotanicalSpeciesMapper } from './mapper/botanical-species.mapper';

@Injectable()
export class BotanicalSpeciesFacadeService {
  public constructor(
    private readonly botanicalSpeciesService: BotanicalSpeciesService,
    private readonly botanicalSpeciesMapper: BotanicalSpeciesMapper
  ) {}

  public findOne(id: string): Promise<BotanicalSpeciesDto> {
    return this.botanicalSpeciesService
      .findOne(id)
      .then((entity: BotanicalSpecies) => this.botanicalSpeciesMapper.toDto(entity));
  }

  public findAll(): Promise<BotanicalSpeciesDto[]> {
    return this.botanicalSpeciesService
      .findAll()
      .then((entities: BotanicalSpecies[]) =>
        entities.map((entity: BotanicalSpecies) => this.botanicalSpeciesMapper.toDto(entity))
      );
  }
}
