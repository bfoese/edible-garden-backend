import { BotanicalFamilyEntity } from 'src/botanical-family/botanical-family-data/entity/botanical-family.entity';
import { EntityMapper } from 'src/core/core-facade/mapper/entity-mapper.interface';
import { CreateBotanicalFamilyDto } from '../dto/create-botanical-family.dto';

export class BotanicalFamilyMapper
  implements EntityMapper<CreateBotanicalFamilyDto, BotanicalFamilyEntity> {
  public toDto(entity: BotanicalFamilyEntity): CreateBotanicalFamilyDto {
    let dto;
    if (entity) {
      dto = new CreateBotanicalFamilyDto();
      dto.botanicalName = entity.botanicalName;
    }
    return dto;
  }

  public toEntity(dto: CreateBotanicalFamilyDto): BotanicalFamilyEntity {
    return null;
  }
}
