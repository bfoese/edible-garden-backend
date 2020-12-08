import { BotanicalFamily } from '@eg-botanical-species/domain/botanical-family.enum';
import { EdiblePart } from '@eg-botanical-species/domain/edible-part.enum';
import { NutritionDemand } from '@eg-botanical-species/domain/nutrition-demand.enum';
import { EntityInfoDto } from '@eg-core/dto/entity-info.dto';
import { ApiProperty } from '@nestjs/swagger';

export class BotanicalSpeciesDto {
  @ApiProperty()
  public entityInfo: Partial<EntityInfoDto>;

  @ApiProperty()
  public botanicalName: string;

  @ApiProperty()
  public i18nNames: {
    [languageCode: string]: string;
  };

  public botanicalFamily: BotanicalFamily;
  public edibleParts: EdiblePart[];
  public nutritionDemand: NutritionDemand;
}
