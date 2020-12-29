import { EntityInfoDto } from '@eg-presentation-facade/shared/dto/entity-info.dto';
import { ApiProperty } from '@nestjs/swagger';
import { TaxonomicRankDto } from './taxonomic-rank.dto';

export class BotanicalNodeDto {
  @ApiProperty({
    type: EntityInfoDto,
  })
  public entityInfo: EntityInfoDto;
  public botanicalName: string;
  public taxonomicRank: TaxonomicRankDto;

  public parent: BotanicalNodeDto;

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
