import { BotanicalFamilyService } from '@eg-data-access/botanical-family/service/botanical-family.service';
import { BotanicalFamily } from '@eg-domain/botanical-family/botanical-family';
import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BotanicalFamilyDto } from 'src/presentation/facade/botanical-family/dto/botanical-family.dto';
import { BotanicalFamilyMapper } from './mapper/botanical-family.mapper';

@Injectable()
export class BotanicalFamilyFacadeService {
  public constructor(
    private botanicalFamilyService: BotanicalFamilyService,
    private readonly botanicalFamilyMapper: BotanicalFamilyMapper
  ) {}

  public findOne(id: string): Observable<Partial<BotanicalFamilyDto>> {
    return this.botanicalFamilyService
      .findOne(id)
      .pipe(map((entity: BotanicalFamily) => this.botanicalFamilyMapper.toDto(entity)));
  }

  public findAll(): Observable<Partial<BotanicalFamilyDto>[]> {
    console.log('facade fidn all', this.botanicalFamilyService);
    return this.botanicalFamilyService
      .findAll()
      .pipe(
        map((entities: BotanicalFamily[]) =>
          entities.map((entity: BotanicalFamily) => this.botanicalFamilyMapper.toDto(entity))
        )
      );
  }
}
