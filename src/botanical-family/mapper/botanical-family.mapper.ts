import { BotanicalFamilyDto } from '@eg-botanical-family/dto/botanical-family.dto';
import { BotanicalFamilyEntity } from '@eg-botanical-family/entity/botanical-family.entity';
import { EntityMapper } from '@eg-core/mapper/entity-mapper.interface';

export class BotanicalFamilyMapper implements EntityMapper<BotanicalFamilyDto, BotanicalFamilyEntity> {
  public toDto(entity: BotanicalFamilyEntity): BotanicalFamilyDto {
    let dto;
    if (entity) {
      dto = new BotanicalFamilyDto();
      dto.botanicalName = entity.botanicalName;
      dto.i18nNames = {};

      if (entity.i18nData) {
        dto.i18nNames = {};
        entity.i18nData.forEach((i18nData) => {
          dto.i18nName[i18nData.languageCode] = i18nData.name;
        });
      }
    }
    return dto;
  }
}
