import { EntityInfoDto } from '@eg-core/dto/entity-info.dto';
import { ApiProperty } from '@nestjs/swagger';

export class BotanicalFamilyDto {
  @ApiProperty()
  public entityInfo: Partial<EntityInfoDto>;

  @ApiProperty()
  public readonly botanicalName: string;

  @ApiProperty()
  public i18nNames: {
    [languageCode: string]: string;
  };
}
