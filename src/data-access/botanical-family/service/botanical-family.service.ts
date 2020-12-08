/* eslint-disable @typescript-eslint/no-unused-vars */
import { BotanicalFamilyMapper } from '@eg-data-access/botanical-family/mapper/botanical-family.mapper';
import { Inject, Injectable } from '@nestjs/common';
import { from, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { BotanicalFamilyDto } from 'src/types-api/botanical-family/botanical-family.dto';
import { CreateBotanicalFamilyDto } from 'src/types-api/botanical-family/create-botanical-family.dto';
import { UpdateBotanicalFamilyDto } from 'src/types-api/botanical-family/update-botanical-family.dto';
import { BotanicalFamilyRepository } from 'src/types-persistence/botanical-family/botanical-family-repository.interface';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const BotanicalFamilyRepo = () => Inject('BotanicalFamilyRepositoryTypeOrm');

@Injectable()
export class BotanicalFamilyService {
  public constructor(
    @BotanicalFamilyRepo() private readonly botanicalFamilyRepository: BotanicalFamilyRepository,
    private botanicalFamilyMapper: BotanicalFamilyMapper
  ) {}

  public create(dto: CreateBotanicalFamilyDto): Observable<Partial<BotanicalFamilyDto>> {
    const entity = this.botanicalFamilyMapper.toEntity(dto);
    return from(this.botanicalFamilyRepository.create(entity)).pipe(
      map((entity) => this.botanicalFamilyMapper.toDto(entity))
    );
  }

  public findAll(): Observable<Partial<BotanicalFamilyDto>[]> {
    return from(this.botanicalFamilyRepository.findAll()).pipe(
      map((entities) => entities.map((entity) => this.botanicalFamilyMapper.toDto(entity)))
    );
  }

  public findOne(id: string): Observable<Partial<BotanicalFamilyDto>> {
    return from(this.botanicalFamilyRepository.findOne(id)).pipe(
      map((entity) => this.botanicalFamilyMapper.toDto(entity))
    );
  }

  public update(id: string, dto: UpdateBotanicalFamilyDto): Observable<Partial<BotanicalFamilyDto>> {
    // TODO here we need complete mapping from dto onto persisted entity
    return from(this.botanicalFamilyRepository.findOne(id)).pipe(
      mergeMap((persistedEntity) => {
        if (dto.botanicalName != undefined) {
          persistedEntity.botanicalName = dto.botanicalName;
        }
        return from(this.botanicalFamilyRepository.save(persistedEntity)).pipe(
          map((entity) => this.botanicalFamilyMapper.toDto(entity))
        );
      })
    );
  }

  public recover(id: string): Promise<boolean> {
    return this.botanicalFamilyRepository.recover(id);
  }

  public softDelete(id: string): Promise<boolean> {
    return this.botanicalFamilyRepository.softDelete(id);
  }

  public delete(id: string): Promise<boolean> {
    return this.botanicalFamilyRepository.delete(id);
  }
}
