import { EntityInfoDto } from '@eg-presentation-facade/shared/dto/entity-info.dto';
import { ApiProperty } from '@nestjs/swagger';

export class BotanicalFamilyDto {
  @ApiProperty({
    type: EntityInfoDto,
  })
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
}
