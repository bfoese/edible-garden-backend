import { GrowingManual } from '@eg-domain/growing-manual/growing-manual';
import { GrowingManualRepository } from '@eg-domain/growing-manual/growing-manual-repository.interface';
import { Inject, Injectable } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const GrowingManualRepo = () => Inject('GrowingManualRepositoryTypeOrm');

@Injectable()
export class GrowingManualService {
  public constructor(@GrowingManualRepo() private readonly growingManualRepository: GrowingManualRepository) {}

  public findAll(): Promise<GrowingManual[]> {
    return this.growingManualRepository.findAll();
  }

  public findOne(id: string): Promise<GrowingManual> {
    return this.growingManualRepository.findOne(id);
  }
}
