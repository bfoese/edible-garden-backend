import { GrowingManual } from '@eg-domain/growing-manual/growing-manual';
import { GrowingManualRepository } from '@eg-domain/growing-manual/growing-manual-repository.interface';
import { Injectable } from '@nestjs/common';
import { FindManyOptions } from 'typeorm';

import { GrowingManualTypeOrmRepository } from '../repository/growing-manual.typeorm-repository';

@Injectable()
export class GrowingManualRepositoryTypeOrmAdapter implements GrowingManualRepository {
  public constructor(private readonly growingManualRepository: GrowingManualTypeOrmRepository) {}

  public findOne(id: string): Promise<GrowingManual> {
    return this.growingManualRepository.findOneOrFail(id);
  }
  public findAll(): Promise<GrowingManual[]> {
    return this.growingManualRepository.find(<FindManyOptions>{
      relations: [
        'i18nData',
        'botanicalNode',
        'botanicalNode.i18nData',
        'botanicalNode.parent',
        'botanicalNode.parent.i18nData',
      ],
    });
  }
}
