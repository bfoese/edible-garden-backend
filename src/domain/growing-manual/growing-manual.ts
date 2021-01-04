import { EdiblePart } from '@eg-domain-constants/edible-part.enum';
import { BotanicalNode } from '@eg-domain/botanical-node/botanical-node';
import { HasI18nData } from '@eg-domain/shared/has-i18n-data.interface';
import { ArrayUnique, IsArray, IsNotEmpty, IsOptional } from 'class-validator';
import { EntityInfo } from '../shared/entity-info';
import { GrowingManualI18n } from './growing-manual-i18n';
import { NutritionDemand } from './nutrition-demand';

export class GrowingManual implements HasI18nData<GrowingManual, GrowingManualI18n> {
  public entityInfo: EntityInfo;

  public i18nData: GrowingManualI18n[];

  @IsNotEmpty()
  public botanicalNode: BotanicalNode;

  @IsArray()
  @ArrayUnique()
  public edibleParts: EdiblePart[];

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
