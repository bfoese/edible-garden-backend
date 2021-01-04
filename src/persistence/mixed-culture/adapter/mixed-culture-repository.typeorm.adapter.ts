import { MixedCulture } from '@eg-domain/mixed-culture/mixed-culture';
import { MixedCultureRepository } from '@eg-domain/mixed-culture/mixed-culture-repository.interface';
import { Injectable } from '@nestjs/common';
import { FindManyOptions } from 'typeorm';
import { MixedCultureTypeOrmRepository } from '../repository/mixed-culture.typeorm-repository';

@Injectable()
export class MixedCultureRepositoryTypeOrmAdapter implements MixedCultureRepository {
  public constructor(private readonly growingManualRepository: MixedCultureTypeOrmRepository) {}

  public findAll(): Promise<MixedCulture[]> {
    return this.growingManualRepository.find(<FindManyOptions>{
      relations: [
        'i18nData',
        'firstCompanion',
        'firstCompanion.i18nData',
        'secondCompanion',
        'secondCompanion.i18nData',
      ],
    });
  }
}
