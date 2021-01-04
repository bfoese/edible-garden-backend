import { BotanicalNodeDto } from '@eg-presentation-facade/botanical-node/dto/botanical-node.dto';
import { EntityInfoDto } from '@eg-presentation-facade/shared/dto/entity-info.dto';
import { ApiProperty } from '@nestjs/swagger';

export class MixedCultureDto {
  public entityInfo: EntityInfoDto;

  @ApiProperty()
  public firstCompanion: BotanicalNodeDto;

  @ApiProperty()
  public secondCompanion: BotanicalNodeDto;

  public isDisadvantageous: boolean;

  @ApiProperty({
    type: 'object',
    additionalProperties: {
      type: 'string',
    },
  })
  public i18nDescriptions: {
    [languageCode: string]: string;
  };
}
