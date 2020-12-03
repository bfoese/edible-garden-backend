import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNotEmptyObject, IsOptional } from 'class-validator';

export class UpdateBotanicalFamilyDto {
  @ApiProperty({
    required: false,
    description:
      'When present, the bonatical name will be updated to the new value',
  })
  @IsOptional()
  @IsNotEmpty()
  botanicalName?: string;

  @ApiProperty({
    required: false,
    description:
      'When present, the given i18n names will be added to the botanical family. In case a name with the given language code already exists, it will be overridden.',
  })
  @IsOptional()
  @IsNotEmptyObject()
  addOrUpdateI18nNames?: {
    [languageCode: string]: string;
  };

  /**
   *
   */
  @ApiProperty({
    required: false,
    description:
      'When present, these translations will be deleted from the botanical family',
  })
  @IsOptional()
  @IsNotEmptyObject()
  removeI18nNames?: {
    [languageCode: string]: string;
  };
}
