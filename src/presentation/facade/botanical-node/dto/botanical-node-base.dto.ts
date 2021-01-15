import { EntityInfoDto } from '@eg-core/facade/dto/entity-info.dto';
import { ApiProperty } from '@nestjs/swagger';

import { TaxonomicRankDto } from './taxonomic-rank.dto';

export class BotanicalNodeBaseDto {
  @ApiProperty({
    type: EntityInfoDto,
  })
  public entityInfo: EntityInfoDto;

  @ApiProperty({
    type: 'string',
  })
  public botanicalName: string;

  @ApiProperty({
    type: 'enum',
    enum: TaxonomicRankDto,
  })
  public taxonomicRank: string;

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
