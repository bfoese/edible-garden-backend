import { BotanicalFamily } from '@eg-domain-constants/botanical-family.enum';
import { EdiblePart } from '@eg-domain-constants/edible-part.enum';
import { NutritionDemand } from '@eg-domain-constants/nutrition-demand.enum';
import { EntityInfoDto } from '@eg-presentation-facade/shared/dto/entity-info.dto';
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
