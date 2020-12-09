import { BotanicalFamilyEntity } from './botanical-family-entity.interface';
import { EntityInfoEntity } from './entity-info-entity.interface';

export interface BotanicalFamilyI18nEntity {
  entityInfo: EntityInfoEntity;
  botanicalFamily: BotanicalFamilyEntity;
  languageCode: string;
  name: string;
}
