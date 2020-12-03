import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNotEmptyObject } from 'class-validator';

export class CreateBotanicalFamilyDto {
  @ApiProperty()
  @IsNotEmpty()
  botanicalName: string;

  @ApiProperty()
  @IsNotEmptyObject()
  i18nNames: {
    [languageCode: string]: string;
  };
}
