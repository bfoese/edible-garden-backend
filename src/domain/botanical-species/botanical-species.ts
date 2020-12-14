import { BotanicalFamily } from '@eg-domain-constants/botanical-family.enum';
import { EdiblePart } from '@eg-domain-constants/edible-part.enum';
import { NutritionDemand } from '@eg-domain-constants/nutrition-demand.enum';
import { EntityInfo } from '../shared/entity-info.entity';
import { BotanicalSpeciesI18n } from './botanical-species-i18n';

export class BotanicalSpecies {
  private _entityInfo: EntityInfo;
  private _botanicalName: string;
  private _i18nData: BotanicalSpeciesI18n[];
  private _botanicalFamily: BotanicalFamily;
  private _edibleParts: EdiblePart[];
  private _nutritionDemand: NutritionDemand;

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

  public set i18nData(i18nData: BotanicalSpeciesI18n[]) {
    this._i18nData = i18nData;
  }

  public get i18nData(): BotanicalSpeciesI18n[] {
    return this._i18nData;
  }

  public set botanicalFamily(botanicalFamily: BotanicalFamily) {
    this._botanicalFamily = botanicalFamily;
  }

  public get botanicalFamily(): BotanicalFamily {
    return this._botanicalFamily;
  }

  public set edibleParts(edibleParts: EdiblePart[]) {
    this._edibleParts = edibleParts;
  }

  public get edibleParts(): EdiblePart[] {
    return this._edibleParts;
  }

  public set nutritionDemand(nutritionDemand: NutritionDemand) {
    this._nutritionDemand = nutritionDemand;
  }

  public get nutritionDemand(): NutritionDemand {
    return this._nutritionDemand;
  }

  /**
   * This method will add or update translations for the given entity.
   * Translations will be checked if their language code is within the set of
   * supported locales (case insensitive comparison) - if not, we silently
   * ignore them.topbar-wrapper
   *
   * @param languageCodeWhitelist - Locales which are supported by the application.
   * Makes sure that no nonsense will be added.
   * @param i18nNames - Translations to be added to the entity
   */
  public addOrUpdateI18nNames(languageCodeWhitelist: string[], i18nNames: { [languageCode: string]: string }): void {
    if (!languageCodeWhitelist || !i18nNames) {
      return;
    }

    for (const [newLanguageCode, newValue] of Object.entries(i18nNames)) {
      // case insensitive check wether the new language code is within our set of supported locales

      const matchingLanguageCode = languageCodeWhitelist.find(
        (whitelistCode) => whitelistCode.toLowerCase() === newLanguageCode.toLowerCase()
      );

      if (!matchingLanguageCode) {
        continue; // none of our supported locales: ignore it
      }

      if (!this.i18nData) {
        this.i18nData = [];
      }

      // remove the old translation if present
      this.i18nData = this.i18nData.filter((i18nData) => i18nData.languageCode !== matchingLanguageCode);

      // add the new translation
      const newI18nData = <BotanicalSpeciesI18n>{
        name: newValue,
        languageCode: matchingLanguageCode,
      };
      this.i18nData.push(newI18nData);
    }
  }

  public removeI18nNames(languageCodes: string[]): void {
    if (languageCodes && this.i18nData) {
      languageCodes.forEach((languageCode: string) => {
        const newI18nData = this.i18nData.filter(
          (i18nData) => i18nData.languageCode.toLowerCase() !== languageCode.toLocaleLowerCase()
        );
        this.i18nData = newI18nData;
      });
    }
  }
}
