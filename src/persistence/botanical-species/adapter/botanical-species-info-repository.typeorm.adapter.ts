import { BotanicalSpeciesInfo } from '@eg-domain/botanical-species-info/botanical-species-info';
import { BotanicalSpeciesInfoRepository } from '@eg-domain/botanical-species-info/botanical-species-info-repository.interface';
import { Injectable } from '@nestjs/common';
import { FindManyOptions } from 'typeorm';
import { BotanicalSpeciesInfoTypeOrmRepository } from '../repository/botanical-species-info.typeorm-repository';

@Injectable()
export class BotanicalSpeciesInfoRepositoryTypeOrmAdapter implements BotanicalSpeciesInfoRepository {
  public constructor(private readonly botanicalSpeciesInfoRepository: BotanicalSpeciesInfoTypeOrmRepository) {}

  public findOne(id: string): Promise<BotanicalSpeciesInfo> {
    return this.botanicalSpeciesInfoRepository.findOneOrFail(id);
  }
  public findAll(): Promise<BotanicalSpeciesInfo[]> {
    return this.botanicalSpeciesInfoRepository.find(<FindManyOptions>{
      relations: [
        'i18nData',
        'botanicalSpecies',
        'botanicalSpecies.i18nData',
        'botanicalSpecies.parent',
        'botanicalSpecies.parent.i18nData',
      ],
    });
  }
}
