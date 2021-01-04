import { EntityInfo } from '@eg-domain/shared/entity-info';
import { I18nEntity } from '@eg-domain/shared/i18n-entity';
import { IsNotEmpty } from 'class-validator';
import { MixedCulture } from './mixed-culture';

export class MixedCultureI18n extends I18nEntity<MixedCulture> {
  public entityInfo: EntityInfo;

  @IsNotEmpty()
  public description: string;
}
