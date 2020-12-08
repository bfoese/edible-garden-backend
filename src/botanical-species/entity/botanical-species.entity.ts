import { BotanicalFamily } from '@eg-botanical-species/domain/botanical-family.enum';
import { EdiblePart } from '@eg-botanical-species/domain/edible-part.enum';
import { NutritionDemand } from '@eg-botanical-species/domain/nutrition-demand.enum';
import { BotanicalSpeciesI18nEntity } from '@eg-botanical-species/entity/botanical-species-i18n.entity';
import { EntityInfo } from '@eg-core/entity/entity-info.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity({ name: 'eg_botanical_species' })
export class BotanicalSpeciesEntity {
  @Column(() => EntityInfo, { prefix: '' })
  public entityInfo: EntityInfo;

  @Column('varchar', { name: 'botanical_name', length: 200, nullable: false, unique: true })
  public botanicalName: string;

  @OneToMany(() => BotanicalSpeciesI18nEntity, (i18nData) => i18nData.botanicalSpecies, {
    cascade: ['insert'],
  })
  public i18nData: BotanicalSpeciesI18nEntity[];

  @Column({ name: 'botanical_family', type: 'enum', enum: BotanicalFamily, nullable: false })
  public botanicalFamily: BotanicalFamily;

  @Column({ name: 'edible_parts', type: 'enum', enum: EdiblePart, array: true, nullable: true })
  public edibleParts: EdiblePart[];

  @Column({ name: 'nutrition_demand', type: 'enum', enum: NutritionDemand, nullable: true })
  public nutritionDemand: NutritionDemand;

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
      const newI18nData = <BotanicalSpeciesI18nEntity>{
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
