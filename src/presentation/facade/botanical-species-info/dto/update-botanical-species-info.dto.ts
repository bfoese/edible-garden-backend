import { EdiblePart } from '@eg-domain-constants/edible-part.enum';
import { NutritionDemand } from '@eg-domain-constants/nutrition-demand.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNotEmptyObject, IsOptional } from 'class-validator';

export class UpdateBotanicalSpeciesDto {
  @ApiProperty({
    required: false,
    description: 'When present, the botanical name will be updated to the new value.',
  })
  @IsOptional()
  @IsNotEmpty()
  public botanicalName?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsNotEmpty()
  public edibleParts?: EdiblePart[];

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsNotEmpty()
  public nutritionDemand?: NutritionDemand;

  @ApiProperty({
    required: false,
    description:
      'When present, the given i18n names will be added to the botanical species. In case a name with the given language code already exists, it will be overridden.',
  })
  @IsOptional()
  @IsNotEmptyObject()
  public addOrUpdateI18nNames?: {
    [languageCode: string]: string;
  };

  @ApiProperty({
    required: false,
    description: 'When present, these translations will be deleted from the botanical species',
  })
  @IsOptional()
  @IsNotEmptyObject()
  public removeI18nNames?: string[];
}
