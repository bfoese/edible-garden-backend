import { BotanicalSpeciesInfoService } from '@eg-data-access/botanical-species/service/botanical-species.service';
import { BotanicalSpeciesInfo } from '@eg-domain/botanical-species-info/botanical-species-info';
import { BotanicalSpeciesInfoDto } from '@eg-presentation-facade/botanical-species-info/dto/botanical-species-info.dto';
import { Injectable } from '@nestjs/common';
import { BotanicalSpeciesInfoMapper } from './mapper/botanical-species-info.mapper';

@Injectable()
export class BotanicalSpeciesInfoFacadeService {
  public constructor(
    private readonly botanicalSpeciesInfoService: BotanicalSpeciesInfoService,
    private readonly botanicalSpeciesInfoMapper: BotanicalSpeciesInfoMapper
  ) {}

  public findOne(id: string): Promise<BotanicalSpeciesInfoDto> {
    return this.botanicalSpeciesInfoService
      .findOne(id)
      .then((entity: BotanicalSpeciesInfo) => this.botanicalSpeciesInfoMapper.toDto(entity));
  }

  public findAll(): Promise<BotanicalSpeciesInfoDto[]> {
    return this.botanicalSpeciesInfoService
      .findAll()
      .then((entities: BotanicalSpeciesInfo[]) =>
        entities.map((entity: BotanicalSpeciesInfo) => this.botanicalSpeciesInfoMapper.toDto(entity))
      );
  }
}
