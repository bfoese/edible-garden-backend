import { EntityInfoDto } from '@eg-core/facade/dto/entity-info.dto';
import { BotanicalNodeDto } from '@eg-presentation-facade/botanical-node/dto/botanical-node.dto';
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
