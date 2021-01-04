import { BotanicalNode } from '@eg-domain/botanical-node/botanical-node';
import { EntityInfo } from '@eg-domain/shared/entity-info';
import { HasI18nData } from '@eg-domain/shared/has-i18n-data.interface';
import { MixedCultureI18n } from './mixed-culture-i18n';

export class MixedCulture implements HasI18nData<MixedCulture, MixedCultureI18n> {
  public entityInfo: EntityInfo;

  /**
   * Might point to different taxonomic ranks, e.g. to a species or a genus
   */
  public firstCompanion: BotanicalNode;

  /**
   * Might point to different taxonomic ranks, e.g. to a species or a genus
   */
  public secondCompanion: BotanicalNode;

  /**
   * Whether the companion has a negative side effect when growing close to the plant in question.
   * If 'false' the relationship is either neutral or beneficial.
   */
  public isDisadvantageous: boolean;

  public i18nData: MixedCultureI18n[];
}
