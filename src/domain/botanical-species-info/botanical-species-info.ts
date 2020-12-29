import { EdiblePart } from '@eg-domain-constants/edible-part.enum';
import { NutritionDemand } from '@eg-domain-constants/nutrition-demand.enum';
import { BotanicalNode } from '@eg-domain/botanical-node/botanical-node';
import { HasI18nData } from '@eg-domain/shared/has-i18n-data.interface';
import { ArrayUnique, IsArray, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { EntityInfo } from '../shared/entity-info';
import { BotanicalSpeciesInfoI18n } from './botanical-species-info-i18n';

export class BotanicalSpeciesInfo implements HasI18nData<BotanicalSpeciesInfo, BotanicalSpeciesInfoI18n> {
  public entityInfo: EntityInfo;

  public i18nData: BotanicalSpeciesInfoI18n[];

  @IsNotEmpty()
  public botanicalSpecies: BotanicalNode;

  @IsArray()
  @ArrayUnique()
  public edibleParts: EdiblePart[];

  @IsEnum(NutritionDemand)
  public nutritionDemand: NutritionDemand;

  // public sowingInfo: SowingInfo;

  /**
   * Whether this plant attracts bees above average.
   * German: Bienenweide
   */
  @IsOptional()
  public isBeePasture?: boolean;

  /**
   * Whether this plant is a good candidate to be used as green manure for helping the soil to recover from nutrient loss.
   * German: Gründungung
   */
  @IsOptional()
  public isGreenManure?: boolean;
}
