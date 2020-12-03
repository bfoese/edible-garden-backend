import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { resolve } from 'path';
import { BotanicalFamilyEntity } from 'src/botanical-family/entity/botanical-family.entity';
import { BotanicalFamilyEntityRepository } from 'src/botanical-family/repository/botanical-family.repository';
import { DeleteResult, UpdateResult } from 'typeorm';
import { CreateBotanicalFamilyDto } from '../dto/create-botanical-family.dto';
import { UpdateBotanicalFamilyDto } from '../dto/update-botanical-family.dto';
import { BotanicalFamilyI18nEntity } from '../entity/botanical-family-i18n.entity';
import { BotanicalFamilyMapper } from '../mapper/botanical-family.mapper';
import _ = require('lodash');

@Injectable()
export class BotanicalFamilyService {
  private readonly botanicalFamilyMapper = new BotanicalFamilyMapper();

  private readonly supportedLocales = ['de_DE', 'en_US'];

  constructor(
    @InjectRepository(BotanicalFamilyEntityRepository)
    private readonly botanicalFamilyRepository: BotanicalFamilyEntityRepository
  ) {}

  create(
    createBotanicalFamilyDto: CreateBotanicalFamilyDto
  ): Promise<BotanicalFamilyEntity> {
    const entity = new BotanicalFamilyEntity();
    entity.botanicalName = createBotanicalFamilyDto.botanicalName;

    BotanicalFamilyService.addOrUpdateI18nNames(
      this.supportedLocales,
      entity,
      createBotanicalFamilyDto.i18nNames
    );
    return this.botanicalFamilyRepository.save(entity);
  }

  findAll(): Promise<BotanicalFamilyEntity[]> {
    return this.botanicalFamilyRepository.find();
  }

  findOne(id: string): Promise<BotanicalFamilyEntity> {
    if (!id) {
      throw new BadRequestException('Object ID is required for this operation');
    }
    return this.botanicalFamilyRepository.findOne(id);
  }

  update(
    id: string,
    dto: UpdateBotanicalFamilyDto
  ): Promise<BotanicalFamilyEntity> {
    return this.botanicalFamilyRepository
      .findOne(id, { relations: ['i18nData'] })
      .then((persistedEntity: BotanicalFamilyEntity) => {
        if (!persistedEntity || !dto) {
          resolve(null);
        }

        // update botanical name if requested
        if (typeof dto.botanicalName !== undefined) {
          persistedEntity.botanicalName = dto.botanicalName;
        }

        // add or update translations if requested
        if (typeof dto.addOrUpdateI18nNames !== undefined) {
          BotanicalFamilyService.addOrUpdateI18nNames(
            this.supportedLocales,
            persistedEntity,
            dto.addOrUpdateI18nNames
          );
        }

        // delete translations if requested
        if (typeof dto.removeI18nNames !== undefined) {
          BotanicalFamilyService.removeI18nNames(
            this.supportedLocales,
            persistedEntity,
            dto.removeI18nNames
          );
        }

        return this.botanicalFamilyRepository.save(persistedEntity);
      });
  }

  softDelete(id: string): Promise<UpdateResult> {
    return this.botanicalFamilyRepository.softDelete(id);
  }

  delete(id: string): Promise<DeleteResult> {
    return this.botanicalFamilyRepository.delete(id);
  }

  private static removeI18nNames(
    supportedLocales: string[],
    botanicalFamily: BotanicalFamilyEntity,
    removeI18nNames: { [languageCode: string]: string }
  ) {
    if (removeI18nNames && botanicalFamily && botanicalFamily.i18nData) {
      for (const [languageCode] of Object.entries(removeI18nNames)) {
        const newI18nData = botanicalFamily.i18nData.filter(
          (i18nData) => i18nData.languageCode !== languageCode
        );
        botanicalFamily.i18nData = newI18nData;
      }
    }
  }

  private static addOrUpdateI18nNames(
    supportedLocales: string[],
    botanicalFamily: BotanicalFamilyEntity,
    i18nNames: { [languageCode: string]: string }
  ) {
    if (!supportedLocales || !botanicalFamily || !i18nNames) {
      return;
    }

    for (const [newLanguageCode, newValue] of Object.entries(i18nNames)) {
      const matchingLanguageCode = _.chain(supportedLocales)
        .filter((x) => {
          x.toLowerCase() === newLanguageCode.toLowerCase();
        })
        .first()
        .value();

      if (!matchingLanguageCode) {
        continue;
      }

      if (!botanicalFamily.i18nData) {
        botanicalFamily.i18nData = [];
      }

      // remove the old translation if present
      botanicalFamily.i18nData = botanicalFamily.i18nData.filter(
        (i18nData) => i18nData.languageCode !== matchingLanguageCode
      );

      // add the new translation
      const newI18nData = new BotanicalFamilyI18nEntity();
      newI18nData.name = newValue;
      newI18nData.languageCode = matchingLanguageCode;

      botanicalFamily.i18nData.push(newI18nData);
    }
  }
}
