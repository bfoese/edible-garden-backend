import { GrowingManualMapper } from './mapper/growing-manual.mapper';
import { GrowingManualService } from '@eg-data-access/growing-manual/service/growing-manual.service';
import { GrowingManual } from '@eg-domain/growing-manual/growing-manual';
import { GrowingManualDto } from '@eg-presentation-facade/growing-manual/dto/growing-manual.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GrowingManualFacadeService {
  public constructor(
    private readonly growingManualService: GrowingManualService,
    private readonly growingManualMapper: GrowingManualMapper
  ) {}

  public findOne(id: string): Promise<GrowingManualDto> {
    return this.growingManualService
      .findOne(id)
      .then((entity: GrowingManual) => this.growingManualMapper.toDto(entity));
  }

  public findAll(): Promise<GrowingManualDto[]> {
    return this.growingManualService
      .findAll()
      .then((entities: GrowingManual[]) =>
        entities.map((entity: GrowingManual) => this.growingManualMapper.toDto(entity))
      );
  }
}
