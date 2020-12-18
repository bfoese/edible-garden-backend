import { BotanicalFamilyService } from '@eg-data-access/botanical-family/service/botanical-family.service';
import { BotanicalFamily } from '@eg-domain/botanical-family/botanical-family';
import { Injectable } from '@nestjs/common';
import { BotanicalFamilyDto } from 'src/presentation/facade/botanical-family/dto/botanical-family.dto';

import { BotanicalFamilyMapper } from './mapper/botanical-family.mapper';

@Injectable()
export class BotanicalFamilyFacadeService {
  public constructor(
    private botanicalFamilyService: BotanicalFamilyService,
    private readonly botanicalFamilyMapper: BotanicalFamilyMapper
  ) {}

  public findOne(id: string): Promise<BotanicalFamilyDto> {
    return this.botanicalFamilyService
      .findOne(id)
      .then((entity: BotanicalFamily) => this.botanicalFamilyMapper.toDto(entity));
  }

  public findAll(): Promise<BotanicalFamilyDto[]> {
    return this.botanicalFamilyService
      .findAll()
      .then((entities: BotanicalFamily[]) =>
        entities.map((entity: BotanicalFamily) => this.botanicalFamilyMapper.toDto(entity))
      );
  }
}
