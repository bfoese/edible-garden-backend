import { BotanicalFamily } from '@eg-botanical-species/domain/botanical-family.enum';
import { EntityInfo } from '@eg-core/entity/entity-info.entity';

export class BotanicalFamilyI18n {
  private _entityInfo: EntityInfo;
  private _botanicalFamily: BotanicalFamily;

  private _languageCode: string;
  private _name: string;

  public set entityInfo(entityInfo: EntityInfo) {
    this._entityInfo = entityInfo;
  }

  public get entityInfo(): EntityInfo {
    return this._entityInfo;
  }

  public set botanicalFamily(botanicalFamily: BotanicalFamily) {
    this._botanicalFamily = botanicalFamily;
  }

  public get botanicalFamily(): BotanicalFamily {
    return this._botanicalFamily;
  }

  public set languageCode(languageCode: string) {
    this._languageCode = languageCode;
  }

  public get languageCode(): string {
    return this._languageCode;
  }

  public set name(name: string) {
    this._name = name;
  }

  public get name(): string {
    return this._name;
  }
}
