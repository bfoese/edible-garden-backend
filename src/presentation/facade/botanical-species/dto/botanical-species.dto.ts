import { EdiblePart } from '@eg-domain-constants/edible-part.enum';
import { NutritionDemand } from '@eg-domain-constants/nutrition-demand.enum';
import { BotanicalFamily } from '@eg-domain/botanical-family/botanical-family';
import { EntityInfoDto } from '@eg-presentation-facade/shared/dto/entity-info.dto';
import { ApiProperty } from '@nestjs/swagger';
import { ArrayUnique, IsEnum } from 'class-validator';

export class BotanicalSpeciesDto {
  public entityInfo: EntityInfoDto;

  public botanicalName: string;

  @ApiProperty({
    type: 'object',
    additionalProperties: {
      type: 'string',
    },
  })
  public i18nNames: {
    [languageCode: string]: string;
  };

  @ApiProperty({
    enum: BotanicalFamily,
  })
  @IsEnum(BotanicalFamily)
  public botanicalFamily: BotanicalFamily;

  @ApiProperty({
    enum: EdiblePart,
    isArray: true,
  })
  @IsEnum(EdiblePart, { each: true })
  @ArrayUnique()
  public edibleParts: EdiblePart[];

  @ApiProperty({
    enum: NutritionDemand,
  })
  @IsEnum(NutritionDemand)
  public nutritionDemand: NutritionDemand;
}
