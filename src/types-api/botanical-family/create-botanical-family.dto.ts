import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNotEmptyObject } from 'class-validator';

export class CreateBotanicalFamilyDto {
  @ApiProperty()
  @IsNotEmpty()
  public botanicalName: string;

  @ApiProperty()
  @IsNotEmptyObject()
  public i18nNames: {
    [languageCode: string]: string;
  };
}
