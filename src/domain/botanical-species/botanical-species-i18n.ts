import { EntityInfo } from '../shared/entity-info.entity';
import { BotanicalSpecies } from './botanical-species';

export class BotanicalSpeciesI18n {
  private _entityInfo: EntityInfo;
  private _botanicalSpecies: BotanicalSpecies;

  private _languageCode: string;
  private _name: string;

  public set entityInfo(entityInfo: EntityInfo) {
    this._entityInfo = entityInfo;
  }

  public get entityInfo(): EntityInfo {
    return this._entityInfo;
  }

  public set botanicalSpecies(botanicalSpecies: BotanicalSpecies) {
    this._botanicalSpecies = botanicalSpecies;
  }

  public get botanicalSpecies(): BotanicalSpecies {
    return this._botanicalSpecies;
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
