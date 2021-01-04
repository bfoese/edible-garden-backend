import { MixedCultureService } from '@eg-data-access/mixed-culture/mixed-culture.service';
import { MixedCulture } from '@eg-domain/mixed-culture/mixed-culture';
import { Injectable } from '@nestjs/common';
import { MixedCultureDto } from './dto/mixed-culture.dto';
import { MixedCultureMapper } from './mapper/mixed-culture.mapper';

@Injectable()
export class MixedCultureFacadeService {
  public constructor(
    private readonly mixedCultureService: MixedCultureService,
    private readonly mixedCultureMapper: MixedCultureMapper
  ) {}

  public findAll(): Promise<MixedCultureDto[]> {
    return this.mixedCultureService
      .findAll()
      .then((entities: MixedCulture[]) =>
        entities.map((entity: MixedCulture) => this.mixedCultureMapper.toDto(entity))
      );
  }
}
