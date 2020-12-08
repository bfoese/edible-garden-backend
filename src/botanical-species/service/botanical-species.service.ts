import { BotanicalSpeciesDto } from '@eg-botanical-species/dto/botanical-species.dto';
import { CreateBotanicalSpeciesDto } from '@eg-botanical-species/dto/create-botanical-species.dto';
import { UpdateBotanicalSpeciesDto } from '@eg-botanical-species/dto/update-botanical-species.dto';
import { BotanicalSpeciesEntity } from '@eg-botanical-species/entity/botanical-species.entity';
import { BotanicalSpeciesMapper } from '@eg-botanical-species/mapper/botanical-species.mapper';
import { BotanicalSpeciesEntityRepository } from '@eg-botanical-species/repository/botanical-species.repository';
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, UpdateResult } from 'typeorm';
import appConfig from '../../config/app.config';

@Injectable()
export class BotanicalSpeciesService {
  public constructor(
    @Inject(appConfig.KEY)
    private appConfigProvider: ConfigType<typeof appConfig>,
    @InjectRepository(BotanicalSpeciesEntityRepository)
    private readonly botanicalSpeciesRepository: BotanicalSpeciesEntityRepository,
    private botanicalSpeciesMapper: BotanicalSpeciesMapper
  ) {}

  public create(dto: CreateBotanicalSpeciesDto): Promise<Partial<BotanicalSpeciesDto>> {
    const entity: Partial<BotanicalSpeciesEntity> = this.botanicalSpeciesMapper.toEntity(dto);
    return this.botanicalSpeciesRepository.save(entity).then((entity) => this.botanicalSpeciesMapper.toDto(entity));
  }

  public findAll(): Promise<BotanicalSpeciesEntity[]> {
    return this.botanicalSpeciesRepository.find();
  }

  public findOne(id: string): Promise<BotanicalSpeciesEntity> {
    if (id == undefined) {
      throw new BadRequestException('Object ID is required for this operation');
    }
    return this.botanicalSpeciesRepository.findOne(id);
  }

  public update(id: string, dto: UpdateBotanicalSpeciesDto): Promise<BotanicalSpeciesEntity> {
    return this.botanicalSpeciesRepository
      .findOne(id, { relations: ['i18nData'], withDeleted: true })
      .then((persistedEntity: BotanicalSpeciesEntity) => {
        if (!persistedEntity) {
          throw new NotFoundException();
        }

        if (!dto) {
          throw new BadRequestException();
        }

        // update botanical name if requested
        if (typeof dto.botanicalName !== undefined) {
          persistedEntity.botanicalName = dto.botanicalName;
        }

        // first delete translations if requested
        if (typeof dto.removeI18nNames !== undefined) {
          persistedEntity.removeI18nNames(dto.removeI18nNames);
        }

        // secondly add or update translations if requested
        if (typeof dto.addOrUpdateI18nNames !== undefined) {
          const importedLocales = <string[]>this.appConfigProvider.importedLocales();
          persistedEntity.addOrUpdateI18nNames(importedLocales, dto.addOrUpdateI18nNames);
        }

        return this.botanicalSpeciesRepository.save(persistedEntity);
      });
  }

  public recover(id: string): Promise<UpdateResult> {
    return this.botanicalSpeciesRepository.restore(id);
  }

  public softDelete(id: string): Promise<UpdateResult> {
    return this.botanicalSpeciesRepository.softDelete(id);
  }

  public delete(id: string): Promise<DeleteResult> {
    return this.botanicalSpeciesRepository.delete(id);
  }
}
