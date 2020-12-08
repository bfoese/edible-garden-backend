import { BotanicalFamily } from '@eg-botanical-species/domain/botanical-family.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNotEmptyObject } from 'class-validator';

export class CreateBotanicalSpeciesDto {
  @ApiProperty()
  @IsNotEmpty()
  public botanicalName: string;

  @ApiProperty()
  @IsNotEmptyObject()
  public i18nNames: {
    [languageCode: string]: string;
  };

  @ApiProperty()
  @IsNotEmptyObject()
  public botanicalFamily: BotanicalFamily;
}
