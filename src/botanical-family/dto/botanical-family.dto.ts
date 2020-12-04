import { BaseDto } from '@eg-core/dto/base.dto';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class BotanicalFamilyDto extends PartialType(BaseDto) {
  @ApiProperty()
  public readonly botanicalName: string;

  @ApiProperty()
  public i18nNames: {
    [languageCode: string]: string;
  };
}
