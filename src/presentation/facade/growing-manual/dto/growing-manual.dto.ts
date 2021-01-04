import { EdiblePart } from '@eg-domain-constants/edible-part.enum';
import { BotanicalNodeDto } from '@eg-presentation-facade/botanical-node/dto/botanical-node.dto';
import { EntityInfoDto } from '@eg-presentation-facade/shared/dto/entity-info.dto';
import { ApiProperty } from '@nestjs/swagger';
import { ArrayUnique, IsEnum } from 'class-validator';
import { NutritionDemandDto } from './nutrition-demand.dto';

export class GrowingManualDto {
  public entityInfo: EntityInfoDto;

  public botanicalNode: BotanicalNodeDto;

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
    enum: EdiblePart,
    isArray: true,
  })
  @IsEnum(EdiblePart, { each: true })
  @ArrayUnique()
  public edibleParts: EdiblePart[];

  @ApiProperty({
    type: NutritionDemandDto,
  })
  public nutritionDemand: NutritionDemandDto;
}
