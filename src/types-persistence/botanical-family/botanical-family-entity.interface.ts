import { BotanicalFamilyI18nEntity } from './botanical-family-i18n-entity.interface';
import { EntityInfoEntity } from './entity-info-entity.interface';

export interface BotanicalFamilyEntity {
  entityInfo: EntityInfoEntity;
  botanicalName: string;
  i18nData: BotanicalFamilyI18nEntity[];
}
