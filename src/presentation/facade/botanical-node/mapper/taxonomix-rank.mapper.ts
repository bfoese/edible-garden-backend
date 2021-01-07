import { TaxonomicRank } from '@eg-domain-constants/taxonomic-rank.enum';
import { DtoEnumMapper } from '@eg-presentation-facade/shared/mapper/dto-mapper.interface';
import { Injectable } from '@nestjs/common';
import { TaxonomicRankDto } from '../dto/taxonomic-rank.dto';

@Injectable()
export class TaxonomicRankMapper implements DtoEnumMapper<TaxonomicRankDto, TaxonomicRank> {
  public toDto(entity: TaxonomicRank): TaxonomicRankDto {
    if (entity) {
      switch (entity) {
        case TaxonomicRank.family:
          return TaxonomicRankDto.Family;
        case TaxonomicRank.species:
          return TaxonomicRankDto.Species;
        case TaxonomicRank.genus:
          return TaxonomicRankDto.Genus;
        case TaxonomicRank.variety:
          return TaxonomicRankDto.Variety;
        case TaxonomicRank.subspecies:
          return TaxonomicRankDto.Subspecies;
      }
    }
    return undefined;
  }

  public toDtoString(entity: TaxonomicRank): string {
    const rankDto = this.toDto(entity);
    if (rankDto) {
      return TaxonomicRankDto[rankDto];
    }
    return undefined;
  }
}
