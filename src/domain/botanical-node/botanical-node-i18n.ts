import { EntityInfo } from '@eg-domain/shared/entity-info';
import { I18nEntity } from '@eg-domain/shared/i18n-entity';
import { IsNotEmpty } from 'class-validator';
import { BotanicalNode } from './botanical-node';

export class BotanicalNodeI18n extends I18nEntity<BotanicalNode> {
  public entityInfo: EntityInfo;

  @IsNotEmpty()
  public name: string;
}
