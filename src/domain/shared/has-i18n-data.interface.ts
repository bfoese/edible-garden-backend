import { I18nEntity } from './i18n-entity';

export interface HasI18nData<Parent, T extends I18nEntity<Parent>> {
  i18nData: T[];
}
