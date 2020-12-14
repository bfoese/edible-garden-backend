import { BotanicalSpeciesService } from '@eg-data-access/botanical-species/service/botanical-species.service';
import { BotanicalSpecies } from '@eg-domain/botanical-species/botanical-species';
import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BotanicalSpeciesDto } from 'src/presentation/facade/botanical-species/dto/botanical-species.dto';
import { BotanicalSpeciesMapper } from './mapper/botanical-species.mapper';

@Injectable()
export class BotanicalSpeciesFacadeService {
  public constructor(
    private readonly botanicalSpeciesService: BotanicalSpeciesService,
    private readonly botanicalSpeciesMapper: BotanicalSpeciesMapper
  ) {}

  public findOne(id: string): Observable<Partial<BotanicalSpeciesDto>> {
    return this.botanicalSpeciesService
      .findOne(id)
      .pipe(map((entity: BotanicalSpecies) => this.botanicalSpeciesMapper.toDto(entity)));
  }

  public findAll(): Observable<Partial<BotanicalSpeciesDto>[]> {
    return this.botanicalSpeciesService
      .findAll()
      .pipe(
        map((entities: BotanicalSpecies[]) =>
          entities.map((entity: BotanicalSpecies) => this.botanicalSpeciesMapper.toDto(entity))
        )
      );
  }
}
