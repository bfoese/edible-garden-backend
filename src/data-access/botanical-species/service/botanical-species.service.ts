import { BotanicalSpeciesInfo } from '@eg-domain/botanical-species-info/botanical-species-info';
import { BotanicalSpeciesInfoRepository } from '@eg-domain/botanical-species-info/botanical-species-info-repository.interface';
import { Inject, Injectable } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const BotanicalSpeciesRepo = () => Inject('BotanicalSpeciesInfoRepositoryTypeOrm');

@Injectable()
export class BotanicalSpeciesInfoService {
  public constructor(
    @BotanicalSpeciesRepo() private readonly botanicalSpeciesRepository: BotanicalSpeciesInfoRepository
  ) {}

  public findAll(): Promise<BotanicalSpeciesInfo[]> {
    return this.botanicalSpeciesRepository.findAll();
  }

  public findOne(id: string): Promise<BotanicalSpeciesInfo> {
    return this.botanicalSpeciesRepository.findOne(id);
  }
}
