import { TaxonomicRank } from '@eg-domain-constants/taxonomic-rank.enum';
import { EntityInfo } from '@eg-domain/shared/entity-info';
import { HasI18nData } from '@eg-domain/shared/has-i18n-data.interface';
import { BotanicalNodeI18n } from './botanical-node-i18n';

export class BotanicalNode implements HasI18nData<BotanicalNode, BotanicalNodeI18n> {
  private _entityInfo: EntityInfo;

  private _botanicalName: string;
  private _i18nData: BotanicalNodeI18n[];

  public taxonomicRank: TaxonomicRank;

  public parent: BotanicalNode;

  public children: BotanicalNode[];

  public set entityInfo(entityInfo: EntityInfo) {
    this._entityInfo = entityInfo;
  }
  public get entityInfo(): EntityInfo {
    return this._entityInfo;
  }

  public set botanicalName(botanicalName: string) {
    this._botanicalName = botanicalName;
  }

  public get botanicalName(): string {
    return this._botanicalName;
  }

  public set i18nData(i18nData: BotanicalNodeI18n[]) {
    this._i18nData = i18nData;
  }

  public get i18nData(): BotanicalNodeI18n[] {
    return this._i18nData;
  }
}
