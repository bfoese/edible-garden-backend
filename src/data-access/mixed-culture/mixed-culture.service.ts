import { MixedCulture } from '@eg-domain/mixed-culture/mixed-culture';
import { MixedCultureRepository } from '@eg-domain/mixed-culture/mixed-culture-repository.interface';
import { Inject, Injectable } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const MixedCultureRepo = () => Inject('MixedCultureRepositoryTypeOrm');

@Injectable()
export class MixedCultureService {
  public constructor(@MixedCultureRepo() private readonly mixedCultureRepository: MixedCultureRepository) {}

  public findAll(): Promise<MixedCulture[]> {
    return this.mixedCultureRepository.findAll();
  }
}
