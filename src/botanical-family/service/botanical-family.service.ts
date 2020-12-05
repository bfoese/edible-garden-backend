import { CreateBotanicalFamilyDto } from '@eg-botanical-family/dto/create-botanical-family.dto';
import { UpdateBotanicalFamilyDto } from '@eg-botanical-family/dto/update-botanical-family.dto';
import { BotanicalFamilyEntity } from '@eg-botanical-family/entity/botanical-family.entity';
import { BotanicalFamilyEntityRepository } from '@eg-botanical-family/repository/botanical-family.repository';
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, UpdateResult } from 'typeorm';
import appConfig from '../../config/app.config';

@Injectable()
export class BotanicalFamilyService {
  public constructor(
    @Inject(appConfig.KEY)
    private appConfig1: ConfigType<typeof appConfig>,
    @InjectRepository(BotanicalFamilyEntityRepository)
    private readonly botanicalFamilyRepository: BotanicalFamilyEntityRepository
  ) {}

  public create(createBotanicalFamilyDto: CreateBotanicalFamilyDto): Promise<BotanicalFamilyEntity> {
    const entity = new BotanicalFamilyEntity();
    entity.botanicalName = createBotanicalFamilyDto.botanicalName;
    const importedLocales = <string[]>this.appConfig1.importedLocales();

    entity.addOrUpdateI18nNames(importedLocales, createBotanicalFamilyDto.i18nNames);
    return this.botanicalFamilyRepository.save(entity);
  }

  public findAll(): Promise<BotanicalFamilyEntity[]> {
    return this.botanicalFamilyRepository.find();
  }

  public findOne(id: string): Promise<BotanicalFamilyEntity> {
    if (!id) {
      throw new BadRequestException('Object ID is required for this operation');
    }
    return this.botanicalFamilyRepository.findOne(id);
  }

  public update(id: string, dto: UpdateBotanicalFamilyDto): Promise<BotanicalFamilyEntity> {
    return this.botanicalFamilyRepository
      .findOne(id, { relations: ['i18nData'], withDeleted: true })
      .then((persistedEntity: BotanicalFamilyEntity) => {
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
          const importedLocales = <string[]>this.appConfig1.importedLocales();
          persistedEntity.addOrUpdateI18nNames(importedLocales, dto.addOrUpdateI18nNames);
        }

        return this.botanicalFamilyRepository.save(persistedEntity);
      });
  }

  public recover(id: string): Promise<UpdateResult> {
    return this.botanicalFamilyRepository.restore(id);
  }

  public softDelete(id: string): Promise<UpdateResult> {
    return this.botanicalFamilyRepository.softDelete(id);
  }

  public delete(id: string): Promise<DeleteResult> {
    return this.botanicalFamilyRepository.delete(id);
  }
}
