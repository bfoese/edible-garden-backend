import { BotanicalFamily } from '@eg-domain/botanical-family/botanical-family';
import { BotanicalFamilyRepository } from '@eg-domain/botanical-family/botanical-family-repository.interface';
import { Injectable } from '@nestjs/common';

import { BotanicalFamilyTypeOrmRepository } from '../repository/botanical-family.typeorm-repository';

@Injectable()
export class BotanicalFamilyRepositoryTypeOrmAdapter implements BotanicalFamilyRepository {
  public constructor(private readonly botanicalFamilyRepository: BotanicalFamilyTypeOrmRepository) {}

  public findOne(id: string): Promise<BotanicalFamily> {
    return this.botanicalFamilyRepository.findOneOrFail(id);
  }
  public findAll(): Promise<BotanicalFamily[]> {
    return this.botanicalFamilyRepository.find();
  }
}
